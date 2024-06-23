import { find } from "@plasmo/utils/array"
import { isAccessible } from "@plasmo/utils/fs"

import { createBgswEntry } from "~features/background-service-worker/bgsw-entry"
import { createBgswMessaging } from "~features/background-service-worker/bgsw-messaging"
import { type PlasmoManifest } from "~features/manifest-factory/base"

export const updateBgswEntry = async (plasmoManifest: PlasmoManifest) => {
  const [bgswIndexFilePath, withMessaging] = await Promise.all([
    find(plasmoManifest.projectPath.backgroundIndexList, isAccessible),
    createBgswMessaging(plasmoManifest)
  ] as const)

  const hasBgsw = Boolean(bgswIndexFilePath) || withMessaging

  if (hasBgsw) {
    await createBgswEntry(
      {
        indexFilePath: bgswIndexFilePath,
        withMessaging
      },
      plasmoManifest
    )
  }

  return plasmoManifest.toggleBackground(hasBgsw)
}
