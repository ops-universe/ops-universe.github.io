export const projects=[
{name:'.github',description:'Organization identity and community governance',status:'Foundation',url:'https://github.com/ops-universe/.github'},
{name:'ops-standards',description:'Engineering contracts, design system and release gates',status:'Foundation',url:'https://github.com/ops-universe/ops-standards'},
{name:'ops-template',description:'Reusable project starter and policy example',status:'Foundation',url:'https://github.com/ops-universe/ops-template'},
{name:'ops-ui',description:'Reusable React components and design tokens',status:'In development',url:'https://github.com/ops-universe/ops-ui'},
{name:'ops-cli',description:'Local repository scaffolding and validation',status:'In development',url:'https://github.com/ops-universe/ops-cli'},
{name:'evalOps',description:'Continuous AI evaluation and regression testing',status:'Planned'},
{name:'guardOps',description:'Governed AI actions and approval policies',status:'Planned'},
{name:'deployOps',description:'Enterprise AI deployment workbench',status:'Planned'}];
export const routes=[
{path:'/',title:'Ops Universe — Engineer responsibly. Deploy confidently.',description:'Open-source AI engineering, forward deployment and responsible automation.'},
{path:'/projects/',title:'Projects | Ops Universe',description:'Explore the Ops Universe foundation and planned AI engineering projects.'},
{path:'/standards/',title:'Engineering standards | Ops Universe',description:'Evidence-driven AI engineering, governance and release standards.'},
{path:'/community/',title:'Community | Ops Universe',description:'Contribute to Ops Universe, report issues and support open-source development.'},
{path:'/404.html',title:'Page not found | Ops Universe',description:'Find your way back to the Ops Universe project directory.',noindex:true}];
export function routeFor(path){return routes.find(r=>r.path===path)||routes.at(-1);}
