import { type FileInfo, default as getFiles } from "getFiles";

export const siteFiles = (extension: string): Array<string> =>
    getFiles({ "root": "./_site" })
        .filter((file: FileInfo): boolean => file.ext == extension)
        .map((file: FileInfo): string => file.path);
