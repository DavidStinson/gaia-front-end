import { Link } from "react-router"

function PageNotFound () {

  return (
    <div className="w-full flex place-content-center">
      <main className="flex flex-col items-start mb-4">
        <h1 
          className="text-4xl xs:text-5xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-[10rem] leading-[1.2] mb-2 md:mb-4 lg:mb-5 xl:mb-8"
        >
          Page Not Found
        </h1>
        <Link
          to="/"
          className="md:text-l lg:text-xl xl:text-2xl transition-all hover:-translate-x-2 ease-in-out motion-reduce:hover:transform-none"
        >
          &larr; Go home
        </Link>
      </main>
    </div>
  )
}

export default PageNotFound
