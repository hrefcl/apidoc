<template>
    <!-- MULTI-VERSION LAYOUT: Show full card with versions and nested languages -->
    <div v-if="showSelector && hasMultipleVersions" class="border-border bg-card mb-6 rounded-lg border p-4">
        <h3 class="mb-3 flex items-center gap-2 text-sm font-semibold">
            <GitBranch class="h-4 w-4" />
            {{ t('api.versions') }} 
        </h3>

        <!-- Version list with nested languages -->
        <div class="space-y-1">
            <div v-for="ver in versions" :key="ver.version" class="version-group">
                <!-- Version button -->
                <button
                    @click="selectVersion(ver.version)"
                    class="flex w-full items-center justify-between rounded px-3 py-2 text-left text-sm transition-colors"
                    :class="isSelected(ver.version) ? 'bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300 font-medium' : 'hover:bg-muted text-foreground'">
                    <span class="font-mono font-semibold">v{{ ver.version }}</span>
                    <Check v-if="isSelected(ver.version)" class="h-4 w-4" />
                </button>

                <!-- Languages for this version (nested, indented) -->
                <div v-if="ver.languages && Object.keys(ver.languages).length > 1" class="ml-4 mt-1 space-y-1 border-l-2 border-border pl-2">
                    <button
                        v-for="(langData, langCode) in ver.languages"
                        :key="`${ver.version}-${langCode}`"
                        @click="selectLanguage(ver.version, langCode)"
                        class="flex w-full items-center gap-2 rounded px-2 py-1.5 text-left text-xs transition-colors"
                        :class="isLanguageSelected(ver.version, langCode) ? 'bg-primary-50 dark:bg-primary-950 text-primary-600 dark:text-primary-400' : 'hover:bg-muted/50 text-muted-foreground'">
                        <span class="text-base">{{ getLanguageFlag(langCode) }}</span>
                        <span class="flex-1">{{ getLanguageName(langCode) }}</span>
                        <span class="font-mono text-[10px] opacity-60">{{ langCode }}</span>
                        <Check v-if="isLanguageSelected(ver.version, langCode)" class="h-3 w-3" />
                    </button>
                </div>
            </div>
        </div>

        <!-- Compare versions button -->
        <div v-if="versions.length > 1" class="border-border mt-4 border-t pt-4">
            <button @click="$emit('compare')" class="bg-muted hover:bg-muted/80 flex w-full items-center justify-center gap-2 rounded px-3 py-2 text-sm font-medium transition-colors">
                <GitCompare class="h-4 w-4" />
                {{ t('api.compareVersions') }}
            </button>
        </div>
    </div>

    <!-- LANGUAGE-ONLY LAYOUT: Show simpler layout with just language buttons -->
    <div v-else-if="showSelector && !hasMultipleVersions" class="border-border bg-card mb-6 rounded-lg border p-4">
        <h3 class="mb-3 flex items-center gap-2 text-sm font-semibold">
            <GitBranch class="h-4 w-4" />
            {{ t('api.availableLanguages') }}
        </h3>

        <!-- Language buttons only (no version grouping) -->
        <div class="space-y-1 version-group">
            <button
                v-for="(langData, langCode) in versions[0].languages"
                :key="`lang-${langCode}`"
                @click="selectLanguage(versions[0].version, langCode)"
                class="flex w-full items-center gap-2 rounded px-3 py-2 text-left text-sm transition-colors"
                :class="isLanguageSelected(versions[0].version, langCode) ? 'bg-primary-50 dark:bg-primary-950 text-primary-600 dark:text-primary-400' : 'hover:bg-muted/50 text-muted-foreground'">
                <span class="text-base">{{ getLanguageFlag(langCode) }}</span>
                <span class="flex-1">{{ getLanguageName(langCode) }}</span>
                <span class="font-mono text-[10px] opacity-60">{{ langCode }}</span>
                <Check v-if="isLanguageSelected(versions[0].version, langCode)" class="h-3 w-3" />
            </button>
        </div>
    </div>
</template>

<script setup>
import { computed, onMounted } from 'vue';
import { useI18n } from 'vue-i18n';
import { GitBranch, GitCompare, Check } from 'lucide-vue-next';
import { useDocsStore } from '../stores/docs';

const { t } = useI18n();
const docsStore = useDocsStore();

const props = defineProps({
    versions: {
        type: Array,
        required: true,
        default: () => [],
    },
    currentVersion: {
        type: String,
        default: null,
    },
    currentLanguage: {
        type: String,
        default: 'en',
    },
});

const emit = defineEmits(['version-change', 'language-change', 'compare']);

onMounted(() => {
    console.log('🎯 VersionSelector MOUNTED with props:', {
        versions: props.versions,
        versionsLength: props.versions?.length,
        currentVersion: props.currentVersion,
        currentLanguage: props.currentLanguage,
        firstVersionHasLanguages: props.versions?.[0]?.languages,
        firstVersionLanguageKeys: props.versions?.[0]?.languages ? Object.keys(props.versions[0].languages) : null
    });
});

const showSelector = computed(() => {
    console.log('🔍 VersionSelector: versions prop:', props.versions);

    // Show if multiple versions OR if single version with multiple languages
    if (props.versions && props.versions.length > 1) return true;
    if (props.versions && props.versions.length === 1) {
        const ver = props.versions[0];
        console.log('🔍 VersionSelector: Single version languages:', ver.languages);
        return ver.languages && Object.keys(ver.languages).length > 1;
    }
    return false;
});

const hasMultipleVersions = computed(() => {
    return props.versions && props.versions.length > 1;
});

const isSelected = (version) => {
    return version === props.currentVersion;
};

const isLanguageSelected = (version, langCode) => {
    return version === props.currentVersion && langCode === props.currentLanguage;
};

const selectVersion = (version) => {
    if (version !== props.currentVersion) {
        emit('version-change', version);
    }
};

const selectLanguage = (version, langCode) => {
    console.log('🌍 VersionSelector: Changing to', version, langCode);

    // If different version, emit version change first
    if (version !== props.currentVersion) {
        emit('version-change', version);
    }

    // Then change language using the store
    docsStore.setLanguage(langCode);
    emit('language-change', { version, language: langCode });
};

// Language helpers
const languageFlags = {
    'en': '🇬🇧',
    'es': '🇪🇸',
    'zh': '🇨🇳',
    'fr': '🇫🇷',
    'de': '🇩🇪',
    'it': '🇮🇹',
    'pt': '🇵🇹',
    'ja': '🇯🇵',
    'ko': '🇰🇷',
    'ru': '🇷🇺',
};

const languageNames = {
    'en': 'English',
    'es': 'Español',
    'zh': '中文',
    'fr': 'Français',
    'de': 'Deutsch',
    'it': 'Italiano',
    'pt': 'Português',
    'ja': '日本語',
    'ko': '한국어',
    'ru': 'Русский',
};

const getLanguageFlag = (langCode) => {
    return languageFlags[langCode] || '🌐';
};

const getLanguageName = (langCode) => {
    return languageNames[langCode] || langCode.toUpperCase();
};
</script>
