import {tools} from './canvas_tools.js'
let T = new tools
const G = 0.01

const canvas = document.createElement('canvas')

canvas.id = 'canvas'

document.body.appendChild(canvas)

class Sun{
    constructor(radius){
        this.radius = radius
        this.mass = (4/3)*Math.PI*radius*radius*radius
        this.pos = {x:canvas.width/2,y:canvas.height/2}
        // density = 1
        this.color = 'yellow'
    }
    draw(){
        T.draw_Ellipse(ctx,this.pos,this.radius,this.radius,this.color)
    }
}

class Planet{
    constructor(S,radius,color,orbital_radius){
        this.radius = radius
        this.mass = (4/3)*Math.PI*radius*radius*radius
        this.pos = {x:S.pos.x+orbital_radius,y:canvas.height/2}
        this.o_rad = orbital_radius
        this.l_velocity = Math.sqrt(G*S.mass/this.o_rad)
        this.r_velocity = this.l_velocity/this.o_rad
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
        T.draw_Stroke_Ellipse(ctx,s.pos,planets[i].o_rad,planets[i].o_rad,'rgb(255,255,255,0.1)')
    }
}

function addPlanet(s,radius,color,o_rad){
    let p = new Planet(s,radius,color,o_rad)
    planets.push(p)
}

function motion(){
    ctx.clearRect(0,0,canvas.width,canvas.height)
    drawCanvas()
    for(let i=0;i<planets.length;i++){
        let alpha = CalAlpha(s.pos,planets[i].pos)
        let thita =  planets[i].r_velocity
        planets[i].pos.x = planets[i].o_rad*Math.cos(thita + alpha) + s.pos.x
        planets[i].pos.y = -planets[i].o_rad*Math.sin(thita + alpha) + s.pos.y
    }
    requestAnimationFrame(motion)
}

function CalAlpha(sun_position,planet_position){
    if(planet_position.x<sun_position.x)
        return Math.atan((sun_position.y-planet_position.y)/(planet_position.x-sun_position.x)) + Math.PI
    else
        return Math.atan((sun_position.y-planet_position.y)/(planet_position.x-sun_position.x))
}

//-------------------------------------------------------------------------------------------------------------------------------------------

addPlanet(s,5,'red',250)
addPlanet(s,8,'blue',300)
addPlanet(s,10,'green',100)

requestAnimationFrame(motion)