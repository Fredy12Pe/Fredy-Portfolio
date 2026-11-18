"use client";

import StickyMenu from "../../(portfolio)/StickyMenu";
import BoardMusic from "./BoardMusic";

// The site's bar at the top of each case study: the same one as the home page (StickyMenu), so the
// nav is identical on every page. Its links lead back to the home page's sections. BoardMusic runs
// the shared music here, so the bar's mini player works as it does on the home page.
export default function BoardNav({ phone = true }: { phone?: boolean }) {
  return (
    <>
      <StickyMenu phoneLogo phone={phone} />
      <BoardMusic />
    </>
  );
}
