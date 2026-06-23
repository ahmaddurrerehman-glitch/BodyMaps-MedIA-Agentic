import { useMemo } from "react";
import * as THREE from "three";

type Vec3 = [number, number, number];

type SceneBounds = {
    min: Vec3;
    max: Vec3;
};

type SceneCrosshair3DProps = {
    position: Vec3;
    bounds: SceneBounds;
    padding?: number;
};

function makeLineGeometry(a: Vec3, b: Vec3) {
    const geometry = new THREE.BufferGeometry();

    geometry.setFromPoints([
        new THREE.Vector3(a[0], a[1], a[2]),
        new THREE.Vector3(b[0], b[1], b[2]),
    ]);

    return geometry;
}

export function SceneCrosshair3D({
    position,
    bounds,
    padding = 50,
}: SceneCrosshair3DProps) {
    const [x, y, z] = position;

    const minX = bounds.min[0] - padding;
    const minY = bounds.min[1] - padding;
    const minZ = bounds.min[2] - padding;

    const maxX = bounds.max[0] + padding;
    const maxY = bounds.max[1] + padding;
    const maxZ = bounds.max[2] + padding;

    /**
     * X line:
     *   x varies
     *   y,z fixed at crosshair position
     *
     * Y line:
     *   y varies
     *   x,z fixed
     *
     * Z line:
     *   z varies
     *   x,y fixed
     */
    const xLineGeometry = useMemo(() => {
        return makeLineGeometry([minX, y, z], [maxX, y, z]);
    }, [minX, maxX, y, z]);

    const yLineGeometry = useMemo(() => {
        return makeLineGeometry([x, minY, z], [x, maxY, z]);
    }, [x, minY, maxY, z]);

    const zLineGeometry = useMemo(() => {
        return makeLineGeometry([x, y, minZ], [x, y, maxZ]);
    }, [x, y, minZ, maxZ]);

    const material = useMemo(() => {
        return new THREE.LineBasicMaterial({
            color: "white",
            depthTest: false,
            depthWrite: false,
            transparent: true,
            opacity: 1,
        });
    }, []);

    return (
        <group renderOrder={999} frustumCulled={false}>
            <line
                geometry={xLineGeometry}
                material={material}
                renderOrder={999}
                frustumCulled={false}
            />

            <line
                geometry={yLineGeometry}
                material={material}
                renderOrder={999}
                frustumCulled={false}
            />

            <line
                geometry={zLineGeometry}
                material={material}
                renderOrder={999}
                frustumCulled={false}
            />
        </group>
    );
}