import HomePage from "../components/HomePage"
import withAuth from "../components/withAuth"

const Page=()=> {
    return (
        <div>
            <HomePage/>
        </div>
    )
  }

  export default withAuth(Page)