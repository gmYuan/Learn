# Vue之 组件通信详解

### 目录

1 [预读文档](#1)

2 [父子间通信](#2)

3 [非父子间通信](#3)


## <span id="1">一 预读文档 </span>

01 [vue中8种组件通信方式](https://juejin.im/post/5d267dcdf265da1b957081a3)

阅读原因: 直接参考文档

02 [Vue 组件间通信六种方式](https://juejin.im/post/5cde0b43f265da03867e78d3)

阅读原因: 具体介绍了一些实用的 注意点和实际使用方法，必读


## <span id="2"> 二 父子间通信 </span>

Q1: 父子间通信 的方式有哪些

A:

S1 `props + this.$emit`: 伪代码示例见下

```html

// 父组件
<template>
  <child-part :name="fatherData" @child-event="xxx(childData)"></child-part>
</template>


// 子组件
<template>
  <button @click="this.$emit('child-event', data1)"></button>
</template>

props: ['name']
```

S2 `this.$children[0].dataXxx + this.$parent.dataYyy`: 伪代码示例见下

```html

// 父组件
<template>
  <child-part></child-part>
  <button @click="changeA">点击改变子组件值</button>
</template>

<script>

  dataYyy: 'fatherValue',

  changeA() {
  this.$children[0].dataXxx = 'new value'  // 获取到子组件A
}
</script>


// 子组件
<template>
  <span>{{messageA}}</span>
  <p> 获取父组件的值为:  {{parentVal}}</p>
</template>

<script>

dataXxx: 'this is old'

computed:{
  parentVal(){
    return this.$parent.dataYyy  // 获取到父组件值
  }
}
</script>
```

关于使用注意点，见下:

![注意点](https://user-gold-cdn.xitu.io/2019/7/11/16bde62519013ad8?imageView2/0/w/1280/h/960/format/webp/ignore-error/1)


S3 `this.refs.xxx`: 伪代码示例见下

> ref：如果在普通的 DOM元素上使用，指向的就是 DOM元素
> 如果用在子组件上，就指向组件实例 + 可以通过实例 直接获取到 组件的方法/数据

```html

// 父组件
<template>
  <child-B ref="childB"></child-B>
</template>

<script>
  const childB = this.$refs.childB;
  console.log(childB.xxx)
</script>


// 子组件B
<template>
  <<div></div>
</template>

<script>

  data() {
    return {
      xxx: 'xxx'
    }
  }
</script>
```


## <span id="3"> 三 非父子间通信 </span>

Q1: 非父子间通信 的方式有哪些

A: 这里的非父子间通信，是指 不仅仅限于父子间，而不是不能用于 父子间通信

S1 `this.$attrs + inheritAttrs + v-bind="$attrs"`: 适用于爷孙通信，伪代码示例见下

```html

// 爷组件A
<template>
  <div>
    <child-B
      d1="1"
      d2="2"
      d3="3"
      d4="4"
    ></child-B>
  </div>
</template>


// 父组件B
<<template class="border">
  <div>
    <p>d1: {{ d1 }}</p>
    <p>childB的 $attrs: {{ $attrs }}</p>
    <child-C v-bind="$attrs"></child-C>
  </div>
</template>

<script>

export default {
  .....

  inheritAttrs: false, // 关闭  自动挂载到组件根元素上的 没有在props声明的属性

  props: {
    d1: String // d1作为props属性绑定
  },

  created() {
    console.log(this.$attrs)  // { "d2": "2", "d3": "3", "d4": "4"}
  }
};
</script>


// 孙组件C
<<template class="border">
  <div>
    <p>d2: {{ d2 }}</p>
    <p>childC的 $attrs: {{ $attrs }}</p>
  </div>
</template>

<script>

export default {
  .....

  inheritAttrs: false, // 关闭  自动挂载到组件根元素上的 没有在props声明的属性

  props: {
    d2: String // d2作为props属性绑定
  },

  created() {
    console.log(this.$attrs)  // { "d3": "3", "d4": "4"}
  }
}
</script>
```


S2 `provide + inject`: 伪代码示例见下

```html

// 提出组件
<template>
  <other-B></other-B>
</template>

<script>
  provide: {
    for: "demo"
  },
</script>


// 注入 组件B/C/D...
<template>
  <<div> {{demo}} </div>
</template>

<script>
  inject: ['for'],

  data() {
    return {
      demo: this.for
    }
  }
</script>
```


S3 `eventBus事件总线`: 伪代码示例见下

```html

// event-bus.js
import Vue from 'vue'
export const EventBus = new Vue()


// A 组件： 发布事件
<template>
  <div>
    <button @click="additionHandle"> 加法器</button> 
  </div>
</template>

<script>
import {EventBus} from './event-bus.js'

num:1,

additionHandle(){
  EventBus.$emit('addition', {
    num:this.num++
  })
}
</script>


// B 组件: 接收事件
<template>
  <div>计算和: {{count}}</div>
</template>

<script>
import { EventBus } from './event-bus.js'

count: 0,

mounted() {
  EventBus.$on('addition', param => {
    this.count = this.count + param.num;
  })
},

EventBus.$off('addition', {})  //销毁监听
</script>
```

S4 `vuex`: 伪代码示例见下

```js

// vuex文件
import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)

const state = {
  // 初始化A和B组件的数据，等待获取
  AMsg: '',
  BMsg: ''
}

const mutations = {
  receiveAMsg(state, payload) {
    // 将A组件的数据存放于state
    state.AMsg = payload.AMsg
  },

  receiveBMsg(state, payload) {
    // 将B组件的数据存放于state
    state.BMsg = payload.BMsg
  }
}

export default new Vuex.Store({
  state,
  mutations
})
```

![vuex图示](https://user-gold-cdn.xitu.io/2019/5/17/16ac35bf70ef8eb1?imageView2/0/w/1280/h/960/format/webp/ignore-error/1)