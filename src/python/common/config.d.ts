export interface ConfigModule {
  get_scripts: () => [string | undefined, string | undefined];
}
