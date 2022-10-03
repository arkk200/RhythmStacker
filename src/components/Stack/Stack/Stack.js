import { forwardRef } from "react";

const Stack = forwardRef(({ position, args, color }, ref) => {
    return (
        <mesh position={position} ref={ref} >
            <boxGeometry args={args} />
            <meshPhongMaterial color={color} />
        </mesh>
    )
})

export default Stack;