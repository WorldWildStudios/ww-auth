// @ts-ignore
import * as azure from "@azure/storage-blob";
import config from '../config.js';
import fs from 'fs';
import Logger from "./Logger";

export default class BlobStorage {
    private _avatarContainerClient: azure.ContainerClient;
    private _blobServiceClient: azure.BlobServiceClient;
    public url: string = "https://cdn.worldwild.studio"

    constructor(logger: Logger) {
        if (!config.azureStorageConnection || !config.azureAvatarStorageContainerName) {
            throw new Error("Missing Azure Storage Connection String or Container Name in configuration");
        }
        this._blobServiceClient = new azure.BlobServiceClient(`https://${config.azureStorageConnection.account}.blob.core.windows.net`, new azure.StorageSharedKeyCredential(config.azureStorageConnection.account, config.azureStorageConnection.key));
        this._avatarContainerClient = this._blobServiceClient.getContainerClient(config.azureAvatarStorageContainerName as string);

        return this;
    }

    public async uploadAvatar(uuid: string, file?: any, url?: string): Promise<string|Error> {
        const blockBlob = this._avatarContainerClient.getBlockBlobClient(uuid + ".png");
        if (file) await blockBlob.uploadFile(file);
        else if (url) {
            const res = await fetch(url as string).catch((err) => {
                return err;
            });
            if (res?.body) {
                const buffer = await res?.arrayBuffer();
                await blockBlob.uploadData(buffer);
            } else {
                return new Error("Invalid URL");
            }
        }
        if (file) {
            fs.unlinkSync(file.path);
        }

        return url + `/avatars/${uuid}.png`;
    };
}