export default function ImageSlider({ images }) {
    return (
        <div className={'w-full flex flex-row overflow-x-scroll'}>
            {images.map((url) => {
                return (
                    <div id={url}>
                        <img src={url} style={{ height:'300px', objectFit:'cover',width: '100%'}} />
                    </div>
                );
            })}
        </div>
    );
}