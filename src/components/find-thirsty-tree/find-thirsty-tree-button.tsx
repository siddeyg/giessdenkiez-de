import React, { useState } from "react";
import { useI18nStore } from "../../i18n/i18n-store";
import { FindThirstyTreeDrawer } from "./find-thirsty-tree-drawer";
import { useFindThirstyTree } from "./use-find-thirsty-tree";

export const FindThirstyTreeButton: React.FC = React.memo(
	function FindThirstyTreeButton() {
		const i18n = useI18nStore().i18n();
		const [isOpen, setIsOpen] = useState(false);
		const { status, results, errorMessage, find, clear } = useFindThirstyTree();

		const handleOpen = () => {
			setIsOpen(true);
			find();
		};

		const handleClose = () => {
			setIsOpen(false);
			clear();
		};

		return (
			<>
				<button
					onClick={handleOpen}
					title={i18n.findThirstyTree.buttonLabel}
					className={`
          flex h-14 w-14 flex-col items-center justify-center rounded-xl pt-1 text-sm font-medium
          hover:bg-blue-600 hover:bg-opacity-10 lg:h-16 lg:w-16 lg:rounded lg:text-base
          ${isOpen ? "bg-blue-600 bg-opacity-10 text-blue-600" : "text-gray-800"}
        `}
				>
					{/* Droplet icon */}
					<svg
						xmlns="http://www.w3.org/2000/svg"
						className="h-5 w-5"
						viewBox="0 0 24 24"
						fill="currentColor"
					>
						<path d="M12 2C12 2 5 10.5 5 15a7 7 0 0 0 14 0c0-4.5-7-13-7-13z" />
					</svg>
					<span className="mt-0.5 leading-tight">
						{i18n.findThirstyTree.buttonLabel}
					</span>
				</button>

				{isOpen && (
					<FindThirstyTreeDrawer
						results={results}
						status={status}
						errorMessage={errorMessage}
						onClose={handleClose}
					/>
				)}
			</>
		);
	},
);
