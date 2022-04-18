import { ArchiveEntry } from "./archive-entry";

export interface WebHookArchive{
    save(message: ArchiveEntry): void;
}