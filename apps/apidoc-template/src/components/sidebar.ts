/**
 * Modern Sidebar Component - Diseño moderno con TailwindCSS
 */

export interface NavItem {
  title?: string;
  isHeader?: boolean;
  isFixed?: boolean;
  group?: string;
  name?: string;
  version?: string;
  url?: string;
  hidden?: boolean;
  type?: string; // GET, POST, PUT, DELETE, etc.
}

export interface GroupSettings {
  icon?: string; // Font Awesome icon class (e.g., 'fa-user', 'fa-shield')
  title?: string; // Custom title for the group
}

export class SidebarComponent {
  private container: HTMLElement;
  private navData: NavItem[] = [];
  private expandedGroups: Set<string> = new Set();
  private selectedItem: string = '';
  private isMobileMenuOpen: boolean = false;
  private projectSettings: Record<string, GroupSettings> = {};

  constructor(container: HTMLElement) {
    this.container = container;
    this.loadProjectSettings();
  }

  private loadProjectSettings() {
    try {
      // Load project configuration from global variable
      if (typeof (window as any).API_PROJECT !== 'undefined') {
        const project = JSON.parse((window as any).API_PROJECT);
        this.projectSettings = project.settings || {};
      }
    } catch (error) {
      console.warn('Could not load project settings:', error);
      this.projectSettings = {};
    }
  }

  setData(navData: NavItem[]) {
    this.navData = navData;
    this.render();
  }

  private toggleGroup(group: string) {
    if (this.expandedGroups.has(group)) {
      this.expandedGroups.delete(group);
    } else {
      this.expandedGroups.add(group);
    }
    this.updateVisibility();
  }

  private selectItem(itemId: string, event: Event) {
    event.preventDefault();
    this.selectedItem = itemId;

    // Actualizar clases activas
    const allItems = this.container.querySelectorAll('.sidebar-nav-item');
    allItems.forEach(item => item.classList.remove('active'));

    const selectedElement = this.container.querySelector(`[data-item-id="${itemId}"]`);
    if (selectedElement) {
      selectedElement.classList.add('active');
    }

    // Navegar al elemento
    const targetElement = document.querySelector(`#${itemId}`);
    if (targetElement) {
      targetElement.scrollIntoView({ behavior: 'smooth' });
    }
  }

  private updateVisibility() {
    const submenuItems = this.container.querySelectorAll('.sidebar-nav-submenu');
    submenuItems.forEach((submenu: HTMLElement) => {
      const header = submenu.previousElementSibling as HTMLElement;
      if (header && header.dataset.group) {
        const group = header.dataset.group;
        const isFixed = header.classList.contains('nav-fixed');
        const isExpanded = this.expandedGroups.has(group);

        if (isFixed) {
          submenu.classList.remove('hidden');
        } else {
          if (isExpanded) {
            submenu.classList.remove('hidden');
          } else {
            submenu.classList.add('hidden');
          }
        }

        // Update chevron rotation
        const chevron = header.querySelector('.transition-transform');
        if (chevron && !isFixed) {
          if (isExpanded) {
            chevron.classList.add('rotate-180');
          } else {
            chevron.classList.remove('rotate-180');
          }
        }
      }
    });

    // Handle individual items visibility based on hidden state
    const items = this.container.querySelectorAll('.sidebar-nav-item[data-group]:not(.nav-header)');
    items.forEach((item: HTMLElement) => {
      if (item.classList.contains('hide')) {
        item.style.display = 'none';
      } else {
        item.style.display = 'block';
      }
    });
  }

  private underscoreToSpace(text: string): string {
    if (!text) return '';
    return text.replace(/_/g, ' ');
  }

  private getIconForGroup(group: string): string {
    // Check for special header/footer icons from project configuration
    if (group === '_header' || group === '_footer') {
      try {
        if (typeof (window as any).API_PROJECT !== 'undefined') {
          const project = JSON.parse((window as any).API_PROJECT);
          const section = group === '_header' ? project.header : project.footer;
          if (section && section.icon) {
            return section.icon;
          }
        }
      } catch (error) {
        console.warn('Could not load header/footer icon settings:', error);
      }
    }

    // Check if there's a custom icon configured for this group
    const customSettings = this.projectSettings[group];
    if (customSettings && customSettings.icon) {
      return customSettings.icon;
    }

    // Default Font Awesome icons for common groups
    const defaultIconMap: Record<string, string> = {
      'User': 'fa-user',
      'Users': 'fa-users',
      'Account': 'fa-user-circle',
      'Auth': 'fa-shield-alt',
      'Authentication': 'fa-key',
      'API': 'fa-code',
      'Endpoints': 'fa-sitemap',
      'Company': 'fa-building',
      'System': 'fa-cogs',
      'City': 'fa-map-marker-alt',
      'Category': 'fa-tags',
      '_header': 'fa-home',
      '_footer': 'fa-info-circle',
      'default': 'fa-file-alt'
    };

    return defaultIconMap[group] || defaultIconMap['default'];
  }

  private getTitleForGroup(group: string): string {
    // Check for special header/footer titles from project configuration
    if (group === '_header' || group === '_footer') {
      try {
        if (typeof (window as any).API_PROJECT !== 'undefined') {
          const project = JSON.parse((window as any).API_PROJECT);
          const section = group === '_header' ? project.header : project.footer;
          if (section && section.title) {
            return section.title;
          }
        }
      } catch (error) {
        console.warn('Could not load header/footer title settings:', error);
      }
    }

    // Check if there's a custom title configured for this group
    const customSettings = this.projectSettings[group];
    if (customSettings && customSettings.title) {
      return customSettings.title;
    }

    // Return the original group name with underscores converted to spaces
    return this.underscoreToSpace(group);
  }

  private getMethodClass(type: string): string {
    const classMap: Record<string, string> = {
      'GET': 'meth-get',
      'POST': 'meth-post',
      'PUT': 'meth-put',
      'PATCH': 'meth-patch',
      'DELETE': 'meth-delete',
      'default': 'meth-get'
    };

    return classMap[type?.toUpperCase()] || classMap['default'];
  }

  private createSidebarHeader(): string {
    return `
      <div class="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
        <div class="flex items-center space-x-3">
          <div class="w-8 h-8 bg-blue-600 dark:bg-blue-500 text-white rounded-lg flex items-center justify-center">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
            </svg>
          </div>
          <div>
            <h2 class="text-sm font-semibold text-gray-900 dark:text-white">API Docs4</h2>
            <p class="text-xs text-gray-500 dark:text-gray-400">Documentation</p>
          </div>
        </div>
        <button id="mobile-menu-close" class="lg:hidden p-1.5 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </button>
      </div>
    `;
  }

  private createNavItemHtml(item: NavItem): string {
    if (!item.title) return '';

    const isHeader = item.isHeader;
    const isFixed = item.isFixed;
    const group = item.group || '';
    const isExpanded = this.expandedGroups.has(group);

    if (isHeader) {
      const headerClass = isFixed ? 'nav-fixed' : '';
      const iconClass = this.getIconForGroup(group);
      const groupTitle = this.getTitleForGroup(group);

      return `
        <div class="sidebar-nav-group">
          <button
            type="button"
            class="sidebar-nav-item nav-header ${headerClass} w-full flex items-center p-3 text-sm font-medium text-gray-700 dark:text-gray-200 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200 ${isExpanded ? 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white' : ''}"
            data-action="toggle-group"
            data-group="${group}"
            role="button"
            aria-haspopup="true"
            aria-expanded="${isExpanded ? 'true' : 'false'}"
          >
            <span class="flex-shrink-0" aria-hidden="true">
              <i class="fas ${iconClass} w-5 h-5 text-center"></i>
            </span>
            <span class="ml-3 flex-1 text-left">${groupTitle}</span>
            ${!isFixed ? `
              <span class="ml-3 flex-shrink-0" aria-hidden="true">
                <svg class="w-4 h-4 transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                </svg>
              </span>
            ` : ''}
          </button>

          <div role="menu" class="mt-1 space-y-1 sidebar-nav-submenu ${isExpanded ? '' : 'hidden'}" aria-label="${this.underscoreToSpace(item.title)}">
        `;
    } else {
      // Item regular de endpoint
      const itemId = `api-${group}-${item.name}`;
      const isSelected = this.selectedItem === itemId;
      const hiddenClass = item.hidden ? 'hide' : '';
      const methodClass = this.getMethodClass(item.type || '');

      return `
            <a
              href="#${itemId}"
              title="${item.title} ${item.url ? '- ' + item.url : ''}"
              role="menuitem"
              class="relative sidebar-nav-item ${hiddenClass} group flex items-center justify-between pl-3 pr-3 py-2.5 text-sm transition-colors duration-200 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 ${isSelected ? 'bg-blue-50 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 border-r-2 border-blue-500' : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100'}"
              data-action="select-item"
              data-item-id="${itemId}"
              data-group="${group}"
              data-name="${item.name}"
              data-version="${item.version}"
            >
              <span class="flow-root max-[15rem]: flex-1 min-w-0 truncate group-hover:text-gray-900 dark:group-hover:text-gray-100 text-ellipsis">${item.title}</span>
              ${item.type ? `<span class="absolute right-[0.2rem] top-[0.7rem] method inline-flex items-center px-1.5 py-0.5 text-xs font-medium text-white rounded-lg uppercase ${methodClass} ml-2 flex-shrink-0" style="font-size: 10px; min-width: auto;">${item.type.toLowerCase()}</span>` : ''}
            </a>
      `;
    }
  }

  private closeGroupHtml(): string {
    return `
          </div>
        </div>
    `;
  }

  private toggleMobileMenu() {
    // For now, keep it simple since we're using flexbox layout
    console.log('Mobile menu toggle clicked');
  }

  private render() {
    if (!this.navData || !Array.isArray(this.navData)) {
      this.container.innerHTML = `
        <div class="h-full flex flex-col bg-white dark:bg-gray-900 transition-colors duration-200">
          ${this.createSidebarHeader()}
          <nav aria-label="Main" class="flex-1 px-4 py-4 space-y-1 overflow-y-auto">
            <div class="sidebar-loading text-gray-500 dark:text-gray-400 text-center py-4">Cargando navegación...</div>
          </nav>
        </div>`;
      return;
    }

    let navItemsHtml = '';
    let needsClose = false;

    this.navData.forEach((item, index) => {
      if (item.isHeader) {
        // Cerrar grupo anterior si existe
        if (needsClose) {
          navItemsHtml += this.closeGroupHtml();
        }

        navItemsHtml += this.createNavItemHtml(item);
        needsClose = true;
      } else {
        navItemsHtml += this.createNavItemHtml(item);
      }

      // Cerrar el último grupo si es necesario
      if (index === this.navData.length - 1 && needsClose) {
        navItemsHtml += this.closeGroupHtml();
      }
    });

    this.container.innerHTML = `
      <div class="h-full flex flex-col bg-white dark:bg-gray-900 transition-colors duration-200">
        ${this.createSidebarHeader()}
        <nav aria-label="Main" class="flex-1 px-4 py-4 space-y-1 overflow-y-auto">
          ${navItemsHtml}
        </nav>
      </div>`;

    this.attachEventListeners();
    this.updateVisibility();
  }

  private attachEventListeners() {
    // Event delegation para manejar clicks
    this.container.addEventListener('click', (event) => {
      const target = event.target as HTMLElement;
      const link = target.closest('[data-action]') as HTMLElement;

      if (!link) return;

      const action = link.dataset.action;

      if (action === 'toggle-group') {
        event.preventDefault();
        const group = link.dataset.group;
        if (group) {
          this.toggleGroup(group);
        }
      } else if (action === 'select-item') {
        const itemId = link.dataset.itemId;
        if (itemId) {
          this.selectItem(itemId, event);
          // Close mobile menu on item selection
          if (this.isMobileMenuOpen) {
            this.toggleMobileMenu();
          }
        }
      }
    });

    // Mobile menu close button
    this.container.addEventListener('click', (event) => {
      const target = event.target as HTMLElement;
      if (target.closest('#mobile-menu-close')) {
        event.preventDefault();
        this.toggleMobileMenu();
      }
    });

    // Mobile menu toggle from navbar
    const mobileToggle = document.querySelector('[data-action="toggle-mobile-menu"]');
    if (mobileToggle) {
      mobileToggle.addEventListener('click', (event) => {
        event.preventDefault();
        this.toggleMobileMenu();
      });
    }
  }
}