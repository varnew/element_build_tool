<template>
  <el-container id="box">
    <!--侯选区-->
    <el-aside id="left" style="wdith: 250px;">

      <div class="components-list">
        <div class="widget-cate">基础字段</div>
        <draggable element="ul" :list="basicComponents"
          :options="{group:{ name:'people', pull:'clone',put:false},sort:false, ghostClass: 'ghost'}"
          @end="handleMoveEnd"
          @start="handleMoveStart"
          :move="handleMove"
        >
          <li class="form-edit-widget-label" v-for="(item, index) in basicComponents" :key="index" style="position: relative">
            <a>
              <icon class="icon" :name="item.icon"></icon>
              <span v-html="item.name"></span>
            </a>
          </li>
        </draggable>

        <div class="widget-cate">高级字段</div>
        <draggable element="ul" :list="advanceComponents"
          :options="{group:{ name:'people', pull:'clone',put:false},sort:false, ghostClass: 'ghost'}"
          @end="handleMoveEnd"
          @start="handleMoveStart"
          :move="handleMove"
        >

          <li class="form-edit-widget-label" v-for="(item, index) in advanceComponents" :key="index">
            <a>
              <icon class="icon" :name="item.icon"></icon>
              <span>{{item.name}}</span>
            </a>
          </li>
        </draggable>

        <div class="widget-cate">布局字段</div>
        <draggable element="ul" :list="layoutComponents"
          :options="{group:{ name:'people', pull:'clone',put:false},sort:false, ghostClass: 'ghost'}"
          @end="handleMoveEnd"
          @start="handleMoveStart"
          :move="handleMove"
        >

          <li class="form-edit-widget-label data-grid" v-for="(item, index) in layoutComponents" :key="index">
            <a>
              <icon class="icon" :name="item.icon"></icon>
              <span>{{item.name}}</span>
            </a>
          </li>
        </draggable>
      </div>

    </el-aside>
    <div id="resize1" @mousedown="handleOnmounsedown($event, 'resize1', 'left', 'center')"></div>
    <!--工作区域-->
    <el-container id="center" class="center-container" direction="vertical">
      <el-header class="btn-bar" style="height: 45px;">
        <!-- <el-button type="text" size="medium" @click="handleGoGithub">GitHub</el-button> -->
        <el-button type="text" size="medium" icon="el-icon-view" @click="handlePreview">预览</el-button>
        <el-button type="text" size="medium" icon="el-icon-tickets" @click="handleGenerateJson">生成JSON</el-button>
        <el-button type="text" size="medium" icon="el-icon-document" @click="handleGenerateCode">生成代码</el-button>
        <el-button type="text" size="medium" icon="el-icon-document" @click="handleGenerateVueCode">生成vue代码</el-button>
      </el-header>
      <el-main :class="{'widget-empty': widgetForm.list.length == 0}">
        <widget-form ref="widgetForm" :data="widgetForm" :select.sync="widgetFormSelect"></widget-form>
      </el-main>
    </el-container>
    <div id="resize2" @mousedown="handleOnmounsedown($event, 'resize2', 'center', 'right')"></div>
    <!--字段属性、表单属性-->
    <el-aside id="right" class="widget-config-container">
      <el-container>
        <el-header height="45px">
          <div class="config-tab" :class="{active: configTab=='widget'}" @click="handleConfigSelect('widget')">字段属性</div>
          <div class="config-tab" :class="{active: configTab=='form'}" @click="handleConfigSelect('form')">表单属性</div>
        </el-header>
        <el-main class="config-content">
          <widget-config v-show="configTab=='widget'" :data="widgetFormSelect"></widget-config>
          <form-config v-show="configTab=='form'" :data="widgetForm.config"></form-config>
        </el-main>
      </el-container>

    </el-aside>

    <cus-dialog
      :visible="previewVisible"
      @on-close="previewVisible = false"
      ref="widgetPreview"
      @on-submit="handleTest"
      width="1000px"
      form
    >
      <generate-form v-if="previewVisible" :data="widgetForm" :remote="remoteFuncs" :value="widgetModels" ref="generateForm">

        <template slot="blank" slot-scope="scope">
          宽度：<el-input v-model="scope.model.blank.width" style="width: 100px"></el-input>
          高度：<el-input v-model="scope.model.blank.height" style="width: 100px"></el-input>
        </template>
      </generate-form>
    </cus-dialog>

    <cus-dialog
      :visible="jsonVisible"
      @on-close="jsonVisible = false"
      ref="jsonPreview"
      width="800px"
      form
    >
      <div id="jsoneditor" style="height: 400px;width: 100%;">{{jsonTemplate}}</div>

      <template slot="action">
        <el-button id="copybtn" data-clipboard-target=".ace_text-input">双击复制</el-button>
      </template>
    </cus-dialog>

    <cus-dialog
      :visible="codeVisible"
      @on-close="codeVisible = false"
      ref="codePreview"
      width="800px"
      form
      :action="false"
    >
      <div id="codeeditor" style="height: 500px; width: 100%;">{{htmlTemplate}}</div>
    </cus-dialog>
    <cus-dialog
      :visible="vueVisible"
      @on-close="vieVisible = false"
      ref="codePreview"
      width="800px"
      form
      :action="false"
    >
      <div id="vueeditor" style="height: 500px; width: 100%;">{{vueTemplate}}</div>
    </cus-dialog>
  </el-container>
</template>

<script>
import Draggable from 'vuedraggable'
import WidgetConfig from './WidgetConfig'
import FormConfig from './FormConfig'
import WidgetForm from './WidgetForm'
import CusDialog from './CusDialog'
import GenerateForm from './GenerateForm'
import Canvas from '@/components/Canvas'
// import JSONEditor from 'jsoneditor'
// import 'jsoneditor/dist/jsoneditor.min.css'
import Clipboard from 'clipboard'
import {basicComponents, layoutComponents, advanceComponents} from './componentsConfig.js'
import {loadJs, loadCss} from '../util/index.js'
import request from '../util/request.js'
import generateCode from './generateCode.js'
import generateVue from './generateVue.js'

export default {
  name: 'fm-making-form',
  components: {
    Draggable,
    WidgetConfig,
    FormConfig,
    WidgetForm,
    CusDialog,
    GenerateForm,
    Canvas
  },
  data () {
    return {
      basicComponents,
      layoutComponents,
      advanceComponents,
      widgetForm: {
        list: [],
        config: {
          labelWidth: 100,
          labelPosition: 'top'
        },
      },
      configTab: 'widget',
      widgetFormSelect: null,
      previewVisible: false,
      jsonVisible: false,
      codeVisible: false,
      vueVisible: false,
      remoteFuncs: {
        func_test (resolve) {
          setTimeout(() => {
            const options = [
              {id: '1', name: '1111'},
              {id: '2', name: '2222'},
              {id: '3', name: '3333'}
            ]

            resolve(options)
          }, 2000)
        },
        funcGetToken (resolve) {
          request.get('http://tools-server.xiaoyaoji.cn/api/uptoken').then(res => {
            resolve(res.uptoken)
          })
        }
      },
      widgetModels: {},
      blank: '',
      htmlTemplate: '',
      vueTemplate: '',
      jsonTemplate: ''
    }
  },
  mounted () {
    document.body.ondrop = function (event) { // 解决每次拖拽后打开新窗口的问题
      event.preventDefault()
      event.stopPropagation()
    }
    // loadCss('https://unpkg.com/jsoneditor/dist/jsoneditor.min.css')
    // loadJs('https://unpkg.com/jsoneditor/dist/jsoneditor.min.js')
    loadJs('lib/ace/src/ace.js')
  },
  methods: {
    handleConfigSelect (value) {
      this.configTab = value
    },
    handleMoveEnd (evt) {
      console.log('end', evt)
    },
    handleMoveStart ({oldIndex}) {
      console.log('start', oldIndex, this.basicComponents)
    },
    handleMove () {
      return true
    },
    handlePreview () {
      this.previewVisible = true
    },
    handleTest () {
      this.$refs.generateForm.getData().then(data => {
        this.$alert(data, '').catch(e=>{})
        this.$refs.widgetPreview.end()
      }).catch(e => {
        this.$refs.widgetPreview.end()
      })
    },
    handleGenerateJson () {
      this.jsonVisible = true
      this.jsonTemplate = this.widgetForm
      this.$nextTick(() => {
        const editor = ace.edit('jsoneditor')
        editor.session.setMode("ace/mode/json")
        const btnCopy = new Clipboard('#copybtn')
      })
    },
    handleGenerateCode () {
      this.codeVisible = true
      this.htmlTemplate = generateCode(JSON.stringify(this.widgetForm))
      this.$nextTick(() => {
        const editor = ace.edit('codeeditor')
        editor.session.setMode("ace/mode/html")
      })
    },
    handleGenerateVueCode () { // 生成vue模板
      this.codeVisible = true
      this.htmlTemplate = generateVue(JSON.stringify(this.widgetForm))
      this.$nextTick(() => {
        const editor = ace.edit('codeeditor')
        editor.session.setMode("ace/mode/html")
      })
      // this.vueVisible = true
      // this.vueTemplate = generateCode(JSON.stringify(this.widgetForm))
      // this.$nextTick(() => {
      //   const editor = ace.edit('vueeditor')
      //   editor.session.setMode("ace/mode/html")
      // })
    },
    handleOnmounsedown (e, resizeId, leftId, rightId) { // 可拖拽宽度
      var resize = document.getElementById(resizeId)
      var left = document.getElementById(leftId)
      var right = document.getElementById(rightId)
      var box = document.getElementById('box')
      var startX = e.clientX
      resize.left = resize.offsetLeft
      document.onmousemove = function(e){
        var endX = e.clientX
        var moveLen = resize.left + (endX - startX)
        var maxT = box.clientWidth - resize.offsetWidth
        if(moveLen<150) moveLen = 150
        if(moveLen>maxT-150) moveLen = maxT-150
        resize.style.left = moveLen
        left.style.width = moveLen + 'px'
        right.style.width = (box.clientWidth - moveLen - 5) + 'px'
      }
      document.onmouseup = function(evt){
        document.onmousemove = null
        document.onmouseup = null
        resize.releaseCapture && resize.releaseCapture()
      }
      resize.setCapture && resize.setCapture()
      return false
    }
  },
  watch: {
    widgetForm: {
      deep: true,
      handler: function (val) {
      }
    }
  }
}
</script>

<style lang="scss">
@import '../styles/cover.scss';
@import '../styles/index.scss';

.widget-empty{
  background: url('../assets/form_empty.png') no-repeat;
  background-position: 50%;
}
#box{
  width:100%;
  overflow:hidden;
}
#resize1,#resize2{
  width: 3px;
  height:100%;
  cursor: w-resize;
  float:left;
  background: #e4e7ed;
}
</style>
