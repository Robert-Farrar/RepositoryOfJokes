import {Link} from 'react-router-dom';

function About(){
    return(
        <div>
            <h1>About</h1>
            <p>Do you like jokes? Do you LOVE them? I do, and I would love to share them with you. </p>
            {/*Link acts as an <a></a> tag that lets you attach links*/}
            <Link to='/UserHome'>Click this link to go home</Link>
        </div>
    );
}

export default About;