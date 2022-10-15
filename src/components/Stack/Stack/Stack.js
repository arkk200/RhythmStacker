import { forwardRef } from "react";

const Stack = forwardRef(({ position, geo, mat }, ref) => {
    return (
        <mesh position={position} ref={ref} >
            <boxGeometry {...geo} />
            <meshPhongMaterial {...mat} />
        </mesh>
    )
})

export default Stack;