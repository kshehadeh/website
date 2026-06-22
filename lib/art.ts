export type ArtPage = {
    position: number;
    title: string;
    filename: string;
    width?: number;
    height?: number;
    version?: number;
};

export type ArtManifest = {
    pages: ArtPage[];
};
