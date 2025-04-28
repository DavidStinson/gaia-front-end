import gaCog from "../../assets/ga-red-cog.png"

function Footer() {
  return (
    <footer 
      className="w-full min-h-[40px] bg-background-nav flex items-center justify-center"
    >
      <img src={gaCog} alt="GA Red Cog" className="h-[25px]" />
    </footer>
  )
}

export default Footer
