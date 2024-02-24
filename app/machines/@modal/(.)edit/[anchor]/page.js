"use client";
import { notFound } from "next/navigation";

import { decrypt, encrypt } from "@/utils/encryption";
import sheetConfig from "@/configs/googleSheet";
import EditMachine from "@/components/EditMachine";
import Modal from "@/components/Modal";
import { useRef } from "react";
import { useLocalStorage } from "@/hooks/useLocalStorage";

export default function Edit({ params }) {
  const modalRef = useRef(null);

  try {
    const anchor = params.anchor;
    const anchoredData = JSON.parse(decrypt(anchor));
    const targetSheet = sheetConfig.sheet.showTabs[0];
    const destAnchor = encrypt(
      JSON.stringify({ sheet: targetSheet.name, rowId: anchoredData.rowId }),
    );

    return (
      <Modal
        ref={modalRef}
        className={`
          flex min-h-screen w-full max-w-full bg-violet-50 p-0 pt-5 text-violet-900 transition-colors duration-500 xl:pt-0
          dark:bg-violet-950 dark:text-white`}
      >
        {
          <EditMachine
            anchor={destAnchor}
            onClose={() => {
              if (modalRef.current?.open) {
                modalRef.current?.close();
              }
              window.postMessage({ updateData: true });
            }}
          />
        }
      </Modal>
    );
  } catch (e) {
    return notFound();
  }
}
