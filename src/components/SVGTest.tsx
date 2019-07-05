import React, { useState } from 'react';

const SVGTest: React.FC = () => {
    let pinchZoomDistance: number;

    const [scale, setScale] = useState(1);
    const [pos, setPos] = useState({x:-20, y:-20});
    const [offset, setOffset] = useState({x: 0, y: 0});

    const [isDragging, setDragging] = useState(false);

    const getClientCoords = (x: number, y: number): {cx:number, cy:number} => {
        const rect: ClientRect = document.getElementsByClassName('svg')[0].getBoundingClientRect();
        return { 
            cx: x - rect.left, 
            cy: y - rect.top
        };
    };

    const dragStart = (x: number, y: number): void => {
        setDragging(true);

        const {cx, cy} = getClientCoords(x, y); 

        setOffset({x:cx, y:cy});
    };

    const dragMove = (x: number, y: number): void => {
        const {cx, cy} = getClientCoords(x, y);

        const nx = pos.x + cx - offset.x;
        const ny = pos.y + cy - offset.y;

        setPos({x:nx, y:ny});
        setOffset({x:cx, y:cy});
    };

    const zoom = (x:number, y:number, deltaY:number): void => {
        const newScale = scale * (1.0 - (deltaY / 1000));
        const scaleDelta = newScale / scale;

        const {cx, cy} = getClientCoords(x, y);

        let nx = cx - (window.innerWidth / 2);
        nx = scaleDelta * (pos.x - nx) + nx;

        let ny = cy - (window.innerHeight / 2) - 10;
        ny = scaleDelta * (pos.y - ny) + ny;
        
        setScale(newScale);
        setPos({x:nx, y:ny});
    }

    const onMouseDown = (ev: React.MouseEvent<SVGElement, MouseEvent>) => {
        dragStart(ev.clientX, ev.clientY);
    };

    const onMouseMove = (ev: React.MouseEvent<SVGElement, MouseEvent>) => {
        if (!isDragging) return;

        dragMove(ev.clientX, ev.clientY);        
    };

    const onMouseUp = (ev: React.MouseEvent<SVGElement, MouseEvent>) => {
        setDragging(false);
    };

    const onWheel = (ev: React.WheelEvent<SVGElement>) => {
        zoom(ev.clientX, ev.clientY, ev.deltaY);
    };

    const onTouchStart = (ev: React.TouchEvent<SVGElement>) => {
        let touches: React.Touch[] = Array.from(ev.touches)
        
        let x: number = touches
            .map(t => t.pageX)
            .reduce((acc, curr) => acc + curr) / touches.length;
        let y: number = touches
            .map(t => t.pageY)
            .reduce((acc, curr) => acc + curr) / touches.length;

        dragStart(x, y);

        if (ev.touches.length === 2) {
            let xDelta = ev.touches[0].pageX - ev.touches[1].pageX;
            let yDelta = ev.touches[0].pageY - ev.touches[1].pageY;
            pinchZoomDistance = Math.sqrt(xDelta * xDelta + yDelta * yDelta);
        }
    };

    const onTouchMove = (ev: React.TouchEvent<SVGElement>) => {
        if (!isDragging) return;

        let touches: React.Touch[] = Array.from(ev.touches);

        let x: number = touches
            .map(t => t.pageX)
            .reduce((acc, curr) => acc + curr) / touches.length;
        let y: number = touches
            .map(t => t.pageY)
            .reduce((acc, curr) => acc + curr) / touches.length;

        dragMove(x, y);

        if(ev.touches.length === 2) {
            let xDelta = ev.touches[0].pageX - ev.touches[1].pageX;
            let yDelta = ev.touches[0].pageY - ev.touches[1].pageY;
            let newPinchZoomDistance = Math.sqrt(xDelta * xDelta + yDelta * yDelta);
            zoom(x, y, scale * newPinchZoomDistance / pinchZoomDistance);
            pinchZoomDistance = newPinchZoomDistance;
        }
    };

    const onTouchEnd = (ev: React.TouchEvent) => {
        setDragging(false);
    };

    return (
        <svg 
            className="svg"
            width={window.innerWidth} 
            height={window.innerHeight - 10} 
            style={{backgroundColor: '#478'}}
            onMouseDown={onMouseDown}
            onMouseMove={onMouseMove}
            onMouseUp={onMouseUp}
            onWheel={onWheel}
            onTouchStart={onTouchStart}
            onTouchMove={onTouchMove}
            onTouchEnd={onTouchEnd}
            onTouchCancel={onTouchEnd}>
            <g transform={`matrix(1,0,0,1,${window.innerWidth / 2},${window.innerHeight / 2 - 10})`}>
                <g transform={`matrix(${scale},0,0,${scale},${pos.x},${pos.y})`}>
                    <rect 
                        width="40" 
                        height="40" 
                        style={{fill:'rgb(40,40,40)'}}></rect>
                </g>
            </g>
        </svg>
    );
}
  
export default SVGTest;
  