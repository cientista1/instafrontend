import React, { Component } from 'react';
import "./Feed.css";
import api,{url, url_image} from "../services/api";
import more from "../assets/more.svg";
import like from "../assets/like.svg";
import comment from "../assets/comment.svg";
import send from "../assets/send.svg";
import io from "socket.io-client";


class Feed extends Component {

    state = {
        feed: [],
    }
    async componentDidMount() {
        const response = await api.get('posts');
        this.setState({ feed: response.data });
        this.RegisterToSocket();
    }

    RegisterToSocket =  () =>{
        const socket = io(url)
        socket.on('post', newPost=>{
            this.setState({feed : [newPost, ... this.state.feed]});
        })
        socket.on('like', likedPost =>{
            this.setState({
                feed: this.state.feed.map(post => 
                    post._id === likedPost._id ? likedPost : post    
                )
            })
        })
        
    }
    handleLike = id =>{
        api.post(`posts/${id}/like`);

    }

    render() {
        return (
            <section id="post-list">
                {this.state.feed.map(post => (
                    <article key={post._id}>
                        <header>
                            <div className="user-info">
                                <span>{post.author}</span>
                                <span className="place"> {post.place}</span>
                            </div>
                            <img src={more} alt="Mais" />
                        </header>
                        <img src={`${url_image}${post.image}`} alt="imagem" />
                        <footer>
                            <div className="actions">
                                <button type="button" onClick={()=>this.handleLike(post._id)} >
                                    <img src={like} alt="" />
                                </button>
                                <img src={comment} alt="" />
                                <img src={send} alt="" />
                            </div>
                            <strong>{post.likes} curtidas</strong>
                            <p>{post.description}
                                <span>{post.hashtags}</span>
                            </p>
                        </footer>
                    </article>
                ))}
            </section>
        )
    }
}

export default Feed;