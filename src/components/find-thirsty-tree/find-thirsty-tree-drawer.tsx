import React from "react";
import { useI18nStore } from "../../i18n/i18n-store";
import { useUrlState } from "../router/store";
import { useTreeStore } from "../tree-detail/stores/tree-store";
import { ThirstyTree } from "./use-find-thirsty-tree";

interface Props {
	results: ThirstyTree[];
	status: "idle" | "locating" | "loading" | "done" | "error";
	errorMessage: string | undefined;
	onClose: () => void;
}

export const FindThirstyTreeDrawer: React.FC<Props> = ({
	results,
	status,
	errorMessage,
	onClose,
}) => {
	const i18n = useI18nStore().i18n();
	const setPathname = useUrlState((s) => s.setPathname);

	const handleSelectTree = (tree: ThirstyTree) => {
		onClose();
		setPathname("/map");
		const abortController = new AbortController();
		useTreeStore.getState().refreshTreeData(tree.id, abortController);
	};

	const ageLabel = (pflanzjahr: number | null): string => {
		if (!pflanzjahr) return "";
		const age = new Date().getFullYear() - pflanzjahr;
		if (age <= 5) return i18n.findThirstyTree.ageBaby;
		if (age <= 10) return i18n.findThirstyTree.ageJunior;
		return "";
	};

	const rainLabel = (radolan_sum: number): string => {
		const mm = (radolan_sum / 10).toFixed(1);
		return i18n.findThirstyTree.rainAmount(mm);
	};

	return (
		<div
			className="pointer-events-auto absolute bottom-16 left-0 right-0 z-50 mx-auto w-full max-w-md rounded-t-3xl bg-white px-4 pb-6 pt-4 shadow-gdk-hard-up lg:bottom-0 lg:left-auto lg:right-4 lg:top-4 lg:max-h-screen lg:overflow-y-auto lg:rounded-2xl lg:rounded-t-2xl"
			role="dialog"
			aria-label={i18n.findThirstyTree.drawerTitle}
		>
			{/* Header */}
			<div className="mb-3 flex items-center justify-between">
				<h2 className="text-base font-semibold text-gray-900">
					{i18n.findThirstyTree.drawerTitle}
				</h2>
				<button
					onClick={onClose}
					className="rounded-full p-1 text-gray-500 hover:bg-gray-100"
					aria-label="Close"
				>
					✕
				</button>
			</div>

			{/* States */}
			{(status === "locating" || status === "loading") && (
				<p className="py-6 text-center text-sm text-gray-500">
					{status === "locating"
						? i18n.findThirstyTree.locating
						: i18n.findThirstyTree.searching}
				</p>
			)}

			{status === "error" && (
				<p className="py-4 text-center text-sm text-red-600">
					{errorMessage ?? i18n.findThirstyTree.error}
				</p>
			)}

			{status === "done" && results.length === 0 && (
				<p className="py-6 text-center text-sm text-gray-500">
					{i18n.findThirstyTree.noResults}
				</p>
			)}

			{/* Results */}
			{status === "done" && results.length > 0 && (
				<ul className="divide-y divide-gray-100">
					{results.map((tree) => (
						<li key={tree.id}>
							<button
								className="flex w-full items-start gap-3 py-3 text-left hover:bg-gray-50"
								onClick={() => handleSelectTree(tree)}
							>
								{/* Rain indicator dot */}
								<span
									className="mt-1 h-3 w-3 flex-shrink-0 rounded-full bg-blue-400"
									style={{ opacity: Math.max(0.2, 1 - tree.radolan_sum / 100) }}
								/>

								<div className="min-w-0 flex-1">
									<p className="truncate text-sm font-medium text-gray-900">
										{tree.art_dtsch ?? i18n.treeDetail.treeTypeUnknown}
										{ageLabel(tree.pflanzjahr) && (
											<span className="ml-2 rounded bg-yellow-100 px-1 text-xs text-yellow-800">
												{ageLabel(tree.pflanzjahr)}
											</span>
										)}
									</p>
									<p className="text-xs text-gray-500">
										{Math.round(tree.distance_m)}m ·{" "}
										{rainLabel(tree.radolan_sum)}
										{tree.last_watered && (
											<> · {i18n.findThirstyTree.lastWatered(tree.last_watered)}</>
										)}
									</p>
								</div>

								<span className="flex-shrink-0 text-gray-400">›</span>
							</button>
						</li>
					))}
				</ul>
			)}
		</div>
	);
};
