<template>
  <div id="app" class="scrollbar">
    <div class="fm-header">
      <div class="fm-title">表单设计器</div>
    </div>
    <div class="fm-container"><router-view/></div>
  </div>
</template>

<script>

export default {
  name: 'app'
}
</script>

<style lang="scss">
.fm-header{
  height: 50px;
  box-shadow: 0 2px 10px rgba(70,160,252, 0.6);
  padding: 0 10px;
  background-image: linear-gradient(to right,#1278f6,#00b4aa);
  position: relative;

  .fm-logo{
    height: 26px;
    vertical-align: middle;
  }
  .fm-title{
    display: inline-block;
    line-height: 50px;
    vertical-align: middle;
    color: #fff;
    font-size: 20px;
    font-weight: 600;
    opacity: 0.8;
    margin-left: 6px;
  }
  .fm-link{
    height: 50px;
    float: right;

    a{
      color: #fff;
      text-decoration: none;
      font-size: 14px;
      line-height: 50px;
      font-weight: 500;
      margin-left: 10px;

      &:hover{
        opacity: 0.8;
      }
    }
  }
}
.fm-container{
  height: calc(100% - 50px);
}
*, :after, :before {
    -webkit-box-sizing: border-box;
    -moz-box-sizing: border-box;
    box-sizing: border-box;
}
html,body{
  height: 100%;
}
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  min-height: 100%;
  height: 100%;
}
::-webkit-scrollbar
{
  width: 4px;  /*滚动条宽度*/
  height: 0px;  /*滚动条高度*/
}
/*定义滚动条轨道 内阴影+圆角*/
::-webkit-scrollbar-track
{
  -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0);
  border-radius: 0px;  /*滚动条的背景区域的圆角*/
  background-color: #67c23a;/*滚动条的背景颜色*/
}
/*定义滑块 内阴影+圆角*/
::-webkit-scrollbar-thumb
{
  border-radius: 0px;  /*滚动条的圆角*/
  -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0);
  background-color: #00b4aa;  /*滚动条的背景颜色*/
}
</style>
