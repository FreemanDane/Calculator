import {calculate} from './calculator'

function coordinateChange(x, y){
    let r_x = 500 + x;
    let r_y = 100 - y;
    let r = [r_x, r_y];
    return r; 
}

export function render(eq){
    let dx = 0.1, cx = -10, max = 0;
    let ctx = document.getElementById('func').getContext("2d");
    let pts = [];
    while (cx < 10){
        let e = eq;
        while (e.indexOf('x') != -1){
            e = e.replace(/x/, '(' + String(cx) + ')');
        }
        let a = Number(calculate(e));
        if (a === false){
            cx += dx;
            continue;
        }
        let result = Math.abs(a);
        if (result > 50){
            cx += dx;
            continue;
        }
        if (result > max){
            max = result;
        }
        cx += dx;
    }
    max++;
    let x_max = 0;
    if (max < 6)
        x_max = max * 5;
    else 
        x_max = 30;
        system(x_max, max, ctx);
    
    for (let cx = -x_max; cx < x_max; cx += x_max / 5000){
        let e = eq;
        while (e.indexOf('x') != -1){
            e = e.replace(/x/, '(' + String(cx) + ')');
        }
        let cy = calculate(e);
        if (Math.abs(cy) > 50)
            continue;
        if (cy === false){
            continue;
        }
        pts.push(coordinateChange(cx / x_max * 500, cy / max * 100));
    }
    points(pts, ctx);
}

function system(max_x, max_y, ctx){
    ctx.clearRect(0, 0, 1000, 200);
    ctx.beginPath();
    ctx.moveTo(0, 100);
    ctx.lineTo(1000, 100);
    ctx.moveTo(500, 0);
    ctx.lineTo(500, 200);
    ctx.stroke();
    ctx.font = '2px Arial'
    ctx.fillText('o', 501, 97);
    let d = max_x / 5;
    for (let i = 0; i < max_x; i += d){
        i = Number(i.toFixed(2));
        let pos_x = i / max_x * 500;
        ctx.fillText(String(i), 501 + pos_x, 97);
        ctx.fillText( String(-i), 501 - pos_x, 97);
    }
    d = max_y / 5;
    for (let i = 0; i < max_y; i += d){
        i = Number(i.toFixed(2));
        let pos_y = i / max_y * 100;
        ctx.fillText(String(i), 501, 97 - pos_y);
        ctx.fillText(String(-i), 501, 97 + pos_y);
    }
}

function points(pts, ctx){
    ctx.beginPath();
    ctx.moveTo(pts[0][0], pts[0][1]);
    let last = pts[0][1]
    for (let p of pts){
        if (Math.abs(p[1] - last) < 50){
            ctx.lineTo(p[0], p[1]);
        }
        else{
            ctx.moveTo(p[0], p[1]);
        }
        last = p[1];
    }
    ctx.stroke();
}
