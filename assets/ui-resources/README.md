# UI Resources direct file archive

Captured from the public catalog at **2026-10-13**. The catalog endpoint listed **1134 resources**. This archive contains every unique direct file URL exposed by the `download_url` and `download_url2` fields at capture time: **977 files** (359.61 MiB), with **0 failed URLs** after retry.

- `files/` contains the files, grouped by catalog category.
- `MANIFEST.csv` maps each resource/link field to its local path and includes source URL, checksum, content type, and byte size. Duplicate catalog links point to one deduplicated local file.
- `LINK-ONLY-RESOURCES.csv` lists the **154 catalog records** without a direct file URL; these are not files exposed for direct download in the catalog API.
- `catalog.json` is the API response used to build the archive.
- `SUMMARY.json` and `failures.json` record the capture totals and download status.

The catalog’s 154 link-only records include sites, software, plugins, tutorials, and other resources whose destinations may be third-party pages or listings. They were not followed as direct file downloads. The catalog may change after this capture. Each asset’s license and creator terms must be checked before commercial use or redistribution; the directory’s availability does not establish a blanket license. No downloaded software or plugins were executed.

## Skill bundle note

In the `ui-figma-roblox` skill, two zip archives (`1010` Vectors by Montzter, `714668956` 5000+ Pixel Icons) are not bundled. Their `MANIFEST.csv` rows are marked `excluded-zip-not-bundled`. The extensionless JPEG for record `1220` was renamed with a `.jpg` extension. The bundle holds 975 files.
