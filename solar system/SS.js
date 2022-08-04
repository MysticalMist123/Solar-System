import {tools} from './canvas_tools.js'
let T = new tools
const G = 0.1

const canvas = document.createElement('canvas')

canvas.id = 'canvas'

document.body.appendChild(canvas)

class Sun{
    constructor(radius){
        this.radius = radius
        this.mass = (4/3)*Math.PI*radius*radius*radius
        this.pos = {x:canvas.width/2-100,y:canvas.height/2}
        // density = 1
        this.color = 'yellow'
    }
    draw(){
        T.draw_Ellipse(ctx,this.pos,this.radius,this.radius,this.color)
    }
}

class Planet{
    constructor(S,radius,color,a,b){
        this.radius = radius
        this.mass = (4/3)*Math.PI*radius*radius*radius
        this.pos = {x:S.pos.x+(a+Math.sqrt(a**2-b**2)),y:S.pos.y}
        this.a = a
        this.b = b
        this.curr_dist = a+Math.sqrt(a**2-b**2)
        this.l_velocity = Math.sqrt(G*S.mass*(2/this.curr_dist - 1/a)) //vis-viva equation
        this.r_velocity = this.l_velocity/this.curr_dist
        // density = 1
        this.color = color
    }
    draw(){
        T.draw_Ellipse(ctx,this.pos,this.radius,this.radius,this.color)
    }
}

const ctx = canvas.getContext("2d")
canvas.width = 850
canvas.height = 670
let sun_radius = 30
let s = new Sun(sun_radius)
let planets = []

//-------------------------------------------------------------------------------------------------------------------------------------------

function drawCanvas(){
    s.draw()
    for(let i=0;i<planets.length;i++){
        planets[i].draw()
        T.draw_Stroke_Ellipse(ctx,{x:s.pos.x+Math.sqrt(planets[i].a**2-planets[i].b**2),y:s.pos.y},planets[i].a,planets[i].b,'rgb(255,255,255,0.1)')
    }
}

function addPlanet(s,radius,color,a,b){
    let p = new Planet(s,radius,color,a,b)
    planets.push(p)
}

function motion(){
    ctx.clearRect(0,0,canvas.width,canvas.height)
    drawCanvas()
    for(let i=0;i<planets.length;i++){
        let alpha = CalAlpha({x:s.pos.x + Math.sqrt(planets[i].a**2-planets[i].b**2),y:s.pos.y},planets[i].pos)
        let thita =  planets[i].r_velocity
        let e = (Math.sqrt(planets[i].a**2-planets[i].b**2)/planets[i].a)
        let R = getR(planets[i],thita,alpha)
        planets[i].pos.x = R*Math.cos(thita + alpha) + (s.pos.x + Math.sqrt(planets[i].a**2-planets[i].b**2))
        planets[i].pos.y = -R*Math.sin(thita + alpha) + s.pos.y

        planets[i].curr_dist = Math.sqrt((s.pos.x-planets[i].pos.x)**2+(s.pos.y-planets[i].pos.y)**2)
        planets[i].l_velocity = Math.sqrt(G*s.mass*(2/planets[i].curr_dist - 1/planets[i].a))
        planets[i].r_velocity = planets[i].l_velocity/planets[i].curr_dist
    }
    requestAnimationFrame(motion)
}

function CalAlpha(sun_position,planet_position){
    if(planet_position.x<sun_position.x)
        return Math.atan((sun_position.y-planet_position.y)/(planet_position.x-sun_position.x)) + Math.PI
    else
        return Math.atan((sun_position.y-planet_position.y)/(planet_position.x-sun_position.x))
}

function getR(planet,thita,alpha) //center to point
{
    let a = planet.a
    let b = planet.b
    let angle = thita + alpha
    return Math.sqrt((a*b)**2/((b*Math.cos(angle))**2+(a*Math.sin(angle))**2))
}

//-------------------------------------------------------------------------------------------------------------------------------------------

addPlanet(s,5,'red',250,200)
addPlanet(s,3,'green',200,150)
addPlanet(s,9,'blue',255,220)
addPlanet(s,3,'violet',500,300)
requestAnimationFrame(motion)