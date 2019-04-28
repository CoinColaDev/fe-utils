export default {
  libDownload :{
    backgroundColor: 'rgb(255, 255, 255)',
    borderTop: 'none',
    height: '70px',
    display: 'flex'
  },
  libClose: {
    width: '35px',
    height: '70px',
    lineHeight: '76px',
    fontWeight: 'lighter'
  },
  libInnerLogo: {
    margin: '10px 8px 0 0',
    width: '50px',
    height: '50px',
    backgroundImage: 'url(https://files-1251297012.cos.ap-hongkong.myqcloud.com/images/logo.png)'
  },
  libInnerContent: {
    flex: 1
  },
  libInnerTitle: {
    fontSize: '1rem',
    height: '1.5em',
    lineHeight: '1.5em',
    margin: 0,
    overflow: 'hidden',
    marginTop: '6px',
    marginBottom: '3px',
    color: 'rgb(51, 51, 51)'
  },
  libInnerDesc: {
    fontSize:' 0.7rem',
    height:' 1.5em',
    lineHeight: '1.5em',
    margin: 0,
    overflow: 'hidden',
    color:' rgb(102, 102, 102)'
  },
  libRedirect: {
    fontSize: '0.8rem',
    width: '90px',
    backgroundImage: '-webkit-gradient(linear,left top,right top,from(#0080fe),to(#45beff))',
    backgroundImage: 'linear-gradient(90deg,#0080fe,#45beff)',
    color: 'rgb(255, 255, 255)',
    display: '-webkit-box',
    WebkitBoxAlign: 'center',
    WebkitBoxPack: 'center',
    fontWeight: 'normal',
    textAlign: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%'
  },
  libCloseBtn: {
    fontSize: '28px',
    width: '14px',
    height: '14px',
    lineHeight: '14px',
    marginLeft: '10.5px',
    content: " ",
    display:' inline-block',
    boxSizing: 'content-box',
    backgroundImage: 'url("data:image/png;base64,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")',
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'center',
    backgroundSize: 'cover'
  }
}