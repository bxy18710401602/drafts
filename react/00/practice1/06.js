function FancyButton (props) {
  return (
    <button className="FancyButton">
      {props.children}
    </button>
  );
}

// 使用React.forwardRef来获取传递给它的ref，然后转发到它渲染的DOM button
const FancyButton = React.forwardRef((props, ref) => (
  <button ref={ref} className="FancyButton">
    {props.children}
  </button>
));

// 你可以直接获取DOM button 的 ref
const ref = React.createRef();
<FancyButton ref={ref}>
  Click me !
</FancyButton>;
