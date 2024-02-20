import { cookies } from "next/headers";
import { AuthVerify } from "@/libs/Auth";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCogs } from "@fortawesome/free-solid-svg-icons";
import { InputSearch } from "@/components/InputSearch";
import { faCopyright } from "@fortawesome/free-regular-svg-icons";
import moment from "moment/moment";
import { MachineList } from "@/components/MachineList";
import { Sidemenu } from "@/components/Sidemenu";
import { MachineListProvider } from "@/contexts/MachineListContext";
import { ButtonSidemenu } from "@/components/ButtonSidemenu";
export const metadata = {
  title: "Machines | Form TSM Jember",
};

export default async function Machines() {
  const cookieStore = cookies();
  const access_token = cookieStore.get("access_token")?.value;
  const decoded = await AuthVerify(access_token);
  const user = decoded?.username;

  return (
    user && (
      <main className="min-w-screen relative z-0 flex min-h-svh flex-col bg-violet-50 text-violet-900 transition-colors duration-500 dark:bg-violet-950 dark:text-white">
        <MachineListProvider>
          <header className="sticky top-0 z-10 flex flex-initial flex-wrap items-center justify-between bg-inherit p-3 pt-8 md:static">
            <div id="title" className="flex-initial p-2">
              <h1 className="text-3xl font-extrabold lg:text-4xl">
                Machine Checklist
              </h1>
            </div>
            <div id="menu-button" className="flex-initial md:order-last">
              <ButtonSidemenu className="flex w-full justify-center rounded-lg p-3 text-base hover:bg-violet-200 dark:hover:bg-purple-800">
                <FontAwesomeIcon icon={faCogs} className="h-5" />
              </ButtonSidemenu>
            </div>
            <div id="search-box" className="flex-auto p-2">
              <InputSearch
                id="input-search-group"
                className="flex w-full items-center justify-start overflow-hidden rounded-full bg-violet-200 p-2 px-3.5"
              />
            </div>
          </header>
          <Sidemenu />
          <MachineList className="z-0" id="content" />

          <footer id="footer" className="flex flex-initial bg-inherit">
            <div
              id="copyright"
              className="flex w-full items-center justify-center p-2 text-sm"
            >
              <FontAwesomeIcon icon={faCopyright} className=" h-3" />{" "}
              <div id="copyright-text">
                {moment().format("yyyy")}, v.2.0.0 by{" "}
                <a
                  href="https://github.com/mazdel"
                  className="text-violet-700 hover:underline dark:font-semibold dark:text-white"
                >
                  delyachmad
                </a>
              </div>
            </div>
          </footer>
        </MachineListProvider>
      </main>
    )
  );
}
