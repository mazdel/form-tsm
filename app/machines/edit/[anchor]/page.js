import { notFound } from "next/navigation";

import { decrypt, encrypt } from "@/utils/encryption";
import sheetConfig from "@/configs/googleSheet";
import EditMachine from "@/components/EditMachine";

export const metadata = {
  title: "Editing Machines | Form TSM Jember",
};
export default async function Edit({ params }) {
  try {
    const anchor = params.anchor;
    const anchoredData = JSON.parse(decrypt(anchor));
    const targetSheet = sheetConfig.sheet.showTabs[0];
    const destAnchor = encrypt(
      JSON.stringify({ sheet: targetSheet.name, rowId: anchoredData.rowId }),
    );

    return (
      <main className="min-w-screen flex bg-violet-50 text-violet-900 transition-colors duration-500 dark:bg-violet-950 dark:text-white">
        <EditMachine anchor={destAnchor} />
      </main>
    );
  } catch (e) {
    return notFound();
  }
}
