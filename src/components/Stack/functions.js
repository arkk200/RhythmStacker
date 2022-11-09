export const addStack = (isEnd, stackCount, stackOverLaps, stackOverHangs, newStack, stackRef, topStack, previousStack) => {
    stackOverLaps.current.push(isEnd ? 
        summonStack(0, 0, 0, 0)
    : isEven(stackCount) ? 
        summonStack(
            (stackRef.current.position.x + previousStack.current.position.x) / 2,
            stackRef.current.position.z,
            topStack.current.width - Math.abs(previousStack.current.position.x - stackRef.current.position.x),
            topStack.current.depth
        )
        : summonStack(
            topStack.current.position.x,
            (stackRef.current.position.z + previousStack.current.position.z)  / 2,
            topStack.current.width,
            topStack.current.depth - Math.abs(previousStack.current.position.z - stackRef.current.position.z)
    ));

    // 걸치지 못한 스택 생성
    stackOverHangs.current.push(isEnd ? 
        summonStack(stackRef.current.position.x, stackRef.current.position.z, topStack.current.width, topStack.current.depth)
    : isEven(stackCount) ?
        summonStack(
            stackOverLaps.current.at(-1).position.x 
                - (topStack.current.width) / 2 * Math.sign(topStack.current.position.x - stackOverLaps.current.at(-1).position.x),
            stackOverLaps.current.at(-1).position.z,
            topStack.current.width - stackOverLaps.current.at(-1).width,
            topStack.current.depth
        )
        : summonStack(
            stackOverLaps.current.at(-1).position.x,
            stackOverLaps.current.at(-1).position.z
                - (topStack.current.depth) / 2 * Math.sign(topStack.current.position.z - stackOverLaps.current.at(-1).position.z),
            topStack.current.width,
            topStack.current.depth - stackOverLaps.current.at(-1).depth
    ))

    newStack.current = isEnd ? 
        summonStack(0, 0, 0, 0)
    : isEven(stackCount) ? 
        summonStack (
            stackRef.current.position.x - (stackRef.current.position.x - previousStack.current.position.x) / 2,
            topStack.current.position.z - 10,
            topStack.current.width - Math.abs(previousStack.current.position.x - stackRef.current.position.x),
            topStack.current.depth
        )
        : summonStack (
            topStack.current.position.x - 10,
            stackRef.current.position.z - (stackRef.current.position.z - previousStack.current.position.z) / 2,
            topStack.current.width,
            topStack.current.depth - Math.abs(previousStack.current.position.z - stackRef.current.position.z)
        );
    previousStack.current = topStack.current;
    topStack.current = stackOverLaps.current.at(-1);
};



export function summonStack(curStksXPos, curStksZPos, curStksWidth, curStksDepth) {
    return {
        position: {
            x: curStksXPos,
            z: curStksZPos
        },
        width: curStksWidth,
        depth: curStksDepth
    }
}



export const isLand = num => (num <= 0);



export function isEven(num) { return !(num % 2) }