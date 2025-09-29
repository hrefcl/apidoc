export interface MarkdownConfigurationObject {
  /** apiDoc project JSON data object (`apidoc.json`) file content) */
  apiDocProjectData: Record<string, any>

  /** apiDoc documentation JSON data object (`api_data.json` file content) */
  apiDocApiData: Array<Record<string, any>>

  /** Name of template to be used (`default`, `bitbucket`)
   * or path to EJS template file
   * or raw EJS plain text template
   * (will use default template if omitted). */
  template?: string

  /** Content to add at the top of the documentation */
  header?: string

  /** Content to add at the bottom of the documentation */
  footer?: string

  /** Content to add before route groups documentation */
  prepend?: string

  /** Generate one documentation output per group */
  multi?: boolean
}

export interface MarkdownConfigurationObjectCLI extends MarkdownConfigurationObject {
  /** Input source files path */
  input: string

  /** Output file or directory to write output to */
  output?: string

  /** Path to file content to add at the top of the documentation */
  headerFile?: string

  /** Path to file content to add at the bottom of the documentation */
  footerFile?: string

  /** Path to file content to add before route groups documentation */
  prependFile?: string

  /** Output one file per group to the `output` directory */
  multi?: boolean

  /** Recursively create directory arborescence to the `output` directory */
  createPath?: boolean

  /** Treat warnings as error and exit with error code. */
  warnError?: boolean
}

export const availableTemplates = {
  default: 'default',
  bitbucket: 'bitbucket'
} as const

export interface MarkdownDocumentationOutput {
  name: string // Api group name
  content: string // Documentation content
  outputFile?: string // File path when written to filesystem
}