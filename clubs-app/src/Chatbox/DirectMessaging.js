// DirectMessaging.js file code
import React, {useState} from 'react';

const DirectMessaging = () => {
    // The useState hook initially sets the username to an empty string
    const[username, setUsername] = useState('')
    //Custom function that will implement the getOrCreateChat function that to select username to chat with
    //only when the correct credentials(user  secret, project id, username) are passed will the application be rendered

    const displayChatInterface = (credentials) => {
        return (
            <div>
                <input
                    type="text"
                    placeholder='Find username'
                    value={username} //prop from the useState hook
                    // A controlled function that sets the username to what the user types in the input field
                    onChange = {(e) => setUsername(e.target.value)}
                />

                {/* clicking button will call the implementingDirectChat function that displays a list of usernames to create or find an existing chat.  */}
                <button>
                    Create Chat
                </button>

            </div>
        )
    }

    return(
        <div></div>
    )
}
export default DirectMessaging;