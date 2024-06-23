import { getFiles, FileInfo } from "../_deps/dev.ts";

export default (): Array<string> => getFiles(
    { "root": "./_site" }
).filter(
    (file: FileInfo): boolean => file.ext == "html"
).map(
    (file: FileInfo): string => file.path
);
