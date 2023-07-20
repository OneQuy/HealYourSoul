// file / dir

export function GetFileExtensionByFilepath(filepath: string): string {
    var dotIdx = filepath.lastIndexOf('.');

    if (dotIdx == -1)
        return '';

    return filepath.substring(dotIdx + 1, filepath.length);
}