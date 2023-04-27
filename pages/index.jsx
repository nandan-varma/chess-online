import Link from "next/link"

function revisedRandId() {
  return Math.random().toString(36).replace(/[^a-z]+/g, '').substr(2, 10);
}

export default function Index(){
  return (
    <>
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@picocss/pico@1/css/pico.min.css"></link>
    <Link href={"/login"}><button>Log In</button></Link>
    <br></br><br></br>    
    <Link href={"/signup"}><button>Sign Up</button></Link>
    <br></br><br></br>    
    <Link href={"/vsAI"}><button>Play with AI</button></Link>
    <br></br><br></br>
    <Link href={"/"+revisedRandId()}><button>Play with friend</button></Link>
    <br></br><br></br>
    <Link href={"/board"}><button>Play Over Board</button></Link>
    </>
  )
}