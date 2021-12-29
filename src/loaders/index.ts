import expressLoader from './express';

export const init = async({ expressApp }: { expressApp: any}): Promise<any> => {
    await expressLoader({ app: expressApp });
}