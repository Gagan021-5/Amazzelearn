import React from "react";

export default function SimulationCanvas({
  title,
  goal,
  itemBankTitle = "Asset Bank",
  itemBankSubtitle = "Draggable items",
  dropCanvasTitle = "Drop Canvas",
  dropCanvasSubtitle = "Assemble the simulation",
  itemBankContent,
  dropCanvasContent,
  itemBankBg = "bg-slate-50",
  dropCanvasBg = "bg-[linear-gradient(135deg,#f8fafc_0%,#ffffff_100%)]",
  goalStyle = "bg-indigo-50 text-indigo-700",
}) {
  return (
    <div className="sim-layout min-h-[80vh]">
      {/* ─── Item Bank (Left Panel - 25% Width on Desktop) ─── */}
      <div className="item-bank flex flex-col max-h-[85vh] xl:sticky xl:top-6">
        <div className="flex flex-wrap items-center justify-between gap-3 shrink-0">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
              {itemBankTitle}
            </p>
            <h2 className="mt-2 text-2xl font-bold text-slate-900">
              {itemBankSubtitle}
            </h2>
          </div>
          {goal && (
            <div className={`rounded-2xl px-4 py-3 ${goalStyle}`}>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] opacity-80">
                Target Objective
              </p>
              <p className="mt-1 text-sm font-bold opacity-100">{goal}</p>
            </div>
          )}
        </div>

        {/* Scrollable asset container */}
        <div className={`inventory-rail hide-scrollbar mt-6 flex-1 overflow-y-auto rounded-3xl ${itemBankBg} p-4`}>
          {itemBankContent}
        </div>
      </div>

      {/* ─── Drop Canvas (Right Panel - 75% Width on Desktop) ─── */}
      <div className="drop-canvas">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
              {dropCanvasTitle}
            </p>
            <h2 className="mt-2 text-2xl font-bold text-slate-900">
              {dropCanvasSubtitle}
            </h2>
          </div>
          <div className="rounded-full bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-600 shadow-sm border border-slate-200">
            Click-to-Select OR Drag-to-Drop
          </div>
        </div>

        <div className={`mt-6 rounded-[28px] ${dropCanvasBg} p-5 sm:p-6 shadow-sm border border-slate-100`}>
          {dropCanvasContent}
        </div>
      </div>
    </div>
  );
}
