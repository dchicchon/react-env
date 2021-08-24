interface Environment {
    root: string,
    dependencies: Object,
    devDependencies: Object
}

export interface Config {
    current: any,
    [index: string]: Environment,
}

