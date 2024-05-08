import React, {useState, useEffect} from "react";
import {Link} from "react-router-dom";

const BlogItem = (props) => {
    
    return (
        <Link key={props?.data?._id} to={`/blog/${props?.data?._id}`}>
            <div className="flex flex-col w-auto h-80 lg:flex-row" style={{ width:'100%'}}>
                <div className="card card-compact bg-base-100 shadow-3xl hover:-translate-y-2 transition duration-200" style={{ width:'100%'}}>
                    <figure>
                        <img
                            src={props?.data?.image}
                            alt="Location Image"
                            style={{ width:'100%'}}
                            className="w-full h-44 opacity-90 object-cover"
                        />
                    </figure>
                    <div className="card-body flex-wrap flex-row flex-col h-48 overflow-hidden">
                        <h2 className="card-title text-md line-clamp-1">
                            {props?.data?.name}
                        </h2>
                        <div className="text-sm flex gap-2 mb-3">
                            {props?.data?.description}
                            <img
                                className="w-5 h-5"
                                src="https://cdn-icons-png.flaticon.com/512/6643/6643359.png"
                                alt="Playground"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </Link>
    );
};

export default BlogItem;
