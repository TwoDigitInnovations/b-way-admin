import { Circles } from "react-loader-spinner";

const Loader = (props) => {
  if (!props.open) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        backdropFilter: 'blur(4px)'
      }}
    >
      <Circles
        height="80"
        width="80"
        color="#FF4B00"
        ariaLabel="circles-loading"
        wrapperStyle={{}}
        wrapperClass=""
        visible={props.open}
      />
    </div>
  );
};

export default Loader;