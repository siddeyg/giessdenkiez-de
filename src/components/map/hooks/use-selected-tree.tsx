import * as mapboxgl from "mapbox-gl";
import { useEffect, useRef } from "react";
import { useTreeStore } from "../../tree-detail/stores/tree-store";
import { useUrlState } from "../../router/store";

export function useSelectedTree(map: mapboxgl.Map | undefined) {
	const addSearchParam = useUrlState((state) => state.addSearchParam);
	const removeSearchParam = useUrlState((state) => state.removeSearchParam);

	const selectedTreeId = useTreeStore((store) => store.selectedTreeId);
	const setSelectedTreeId = useTreeStore((store) => store.setSelectedTreeId);

	const selectedTreeIdRef = useRef<string | undefined>(undefined);

	const applyFeatureState = (
		map: mapboxgl.Map,
		id: string,
		isSelected: boolean,
	) => {
		if (!map.getSource("trees")) return;
		map.setFeatureState(
			{ id, source: "trees", sourceLayer: "trees" },
			{ select: isSelected },
		);
	};

	const setSelectState = (id: string, isSelected: boolean) => {
		if (!map) {
			return;
		}

		if (map.getSource("trees")) {
			applyFeatureState(map, id, isSelected);
		} else {
			const handler = () => {
				if (!map.getSource("trees")) return;
				applyFeatureState(map, id, isSelected);
				map.off("styledata", handler);
			};
			map.on("styledata", handler);
		}

		if (isSelected) {
			addSearchParam("treeId", id);
		} else {
			removeSearchParam("treeId");
		}
	};

	useEffect(() => {
		if (!map) {
			return;
		}

		if (selectedTreeIdRef.current) {
			setSelectState(selectedTreeIdRef.current, false);
		}

		if (selectedTreeId) {
			setSelectState(selectedTreeId, true);
		}

		selectedTreeIdRef.current = selectedTreeId;
	}, [selectedTreeId]);

	return { selectedTreeIdRef, setSelectedTreeId };
}
