interface Environment {
    root: string,
    dependencies: Object,
    devDependencies: Object
}

export interface Config {
    current: string,
    envs: {
        [index: string]: Environment
    }
}

