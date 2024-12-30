<template>
  <div id="editblog-template">

    <a-layout class="variable_content" style="padding: 15px">
      <router-link
        to="/editblog/newblog"
        scoped-slots="button"
        class="custom-button"
        @click="this.fetch_data"
      >
        写新博客
      </router-link>
      <a-layout-content
        :style="{
          background: '#fff',
          padding: '20px',
          margin: 0,
          width: '100%',
          minHeight: '280px',
        }"
      >
        <div>
          <h1>
            <b class="b_green">{{ this.title }}</b>
          </h1>

          <a-form>
            <a-form-item v-if="this.blog_id !== 'newblog'" label="博客 ID：">
              <p>{{ this.blog_id }}</p>
            </a-form-item>
            <a-form-item label="一级目录：">
              <textarea
                v-model="this.blog_directory_1"
                :rows="1"
                style="display: inline-block; margin-left: auto; margin-right: auto;"
              />
            </a-form-item>
            <a-form-item label="二级目录：">
              <textarea
                v-model="this.blog_directory_2"
                :rows="1"
                style="display: inline-block; margin-left: auto; margin-right: auto;"
              />
            </a-form-item>
            <a-form-item label="博客标题：">
              <textarea
                v-model="this.blog_title"
                :rows="1"
                style="display: inline-block; margin-left: auto; margin-right: auto;"
              />
            </a-form-item>
            <a-form-item label="是否展示博客">
              <a-radio-group v-model:value="this.blog_hidden">
                <a-radio value=0>展示</a-radio>
                <a-radio value=1>隐藏</a-radio>
              </a-radio-group>
            </a-form-item>
            <a-form-item v-if="this.blog_id === 'newblog'" label="发布日期">
              <textarea
                v-model="this.blog_established_time"
                :rows="1"
                style="display: inline-block; margin-left: auto; margin-right: auto;"
              />
            </a-form-item>
            <a-form-item v-else label="发布日期">
              <p>{{ this.blog_established_time }}</p>
            </a-form-item>
            <a-form-item label="编辑日期">
              <textarea
                v-model="this.blog_edited_time"
                :rows="1"
                style="display: inline-block; margin-left: auto; margin-right: auto;"
              />
            </a-form-item>
            <a-form-item label="访问人数">
              <textarea
                v-model="this.blog_visitor_count"
                :rows="1"
                style="display: inline-block; margin-left: auto; margin-right: auto;"
              />
            </a-form-item>
            <a-form-item label="博客正文">
              <textarea
                v-model="this.blog_text"
                :rows="30"
                :maxlength="40000"
                placeholder="请写入 markdown 博客正文"
                style="display: inline-block; margin-left: auto; margin-right: auto;"
              />
            </a-form-item>

            <a-form-item label="上传图片">
              <a-upload
                class="upload-list-inline"
                name="image_data"
                :multiple="true"
                :action="uploadAction"
                list-type="picture"
                :headers="this.headers"
                :data="{'blog_id': conditionalBlogId,
                        'hash_code': this.hash_code,
                        'random_num': this.random_int}"
                v-model:file-list="this.fileList"
                :beforeUpload="beforeUpload"
                @change="handleChange"
                :disabled="disabled">
                  <a-button>
                    <upload-outlined></upload-outlined>
                    upload >
                  </a-button>

              </a-upload>
            </a-form-item>
            <a-form-item label="已有图片">

              <a-card
                  v-for="(image_path, index) in this.blog_image_path"
                  :key="index"
                  hoverable style="width: 500px; display:center;" >
                <template #cover>
                  <img alt="example" style="height: 120px; width: auto;" :src="image_path" />
                </template>
                <a-card-meta title="">
                  <template #description>![]({{ image_path }})</template>
                </a-card-meta>
              </a-card>
            </a-form-item>
          </a-form>
          <a-form-item style="display: flex; align-items: left;">
            <a-button
              style="
                display: inline-block;
                margin-bottom: 10px;
                margin-left: 30px;
                margin-right: 30px;
              "
              type="primary"
              @click="send_edited_blog"
              >提交文本
              <CaretRightOutlined />
            </a-button>
            <div style="display: inline-block;" v-if="this.already_updated_flag == true">
              <p style="display: inline-block;" >{{ this.update_info }}</p>
            </div>
          </a-form-item>

          <a-form-item style="display: flex; align-items: left;">
            <a-button
              style="
                display: inline-block;
                margin-bottom: 10px;
                margin-left: 30px;
                margin-right: 30px;
              "
              type="primary"
              @click="delete_blog"
              >删除博客
              <CaretRightOutlined />
            </a-button>
            <div style="display: inline-block;" v-if="this.already_deleted_flag == true">
              <p style="display: inline-block;" >{{ this.delete_info }}</p>
            </div>
          </a-form-item>
          <div v-if="this.blog_id !== 'newblog'" v-html="markdownToHtml"></div>
        </div>
      </a-layout-content>
    </a-layout>
  </div>
</template>

<script>
// import { useMeta } from 'vue-meta';
import router from "../../router/index";
import { blog_backend } from "@/utils/request";
// import { HomeOutlined } from "@ant-design/icons-vue";
import authentication_hash_code from "@/utils/authentication";

const config = require("@/global_config");


// import { ref } from 'vue';
// import { message } from 'ant-design-vue';
// import type { UploadChangeParam } from 'ant-design-vue';
// import { PlusOutlined, UploadOutlined } from '@ant-design/icons-vue';
// import type { TreeSelectProps, CascaderProps } from 'ant-design-vue';

const FILE_TYPE_IMG = "image"

const uidGenerator = () => {
  return '-' + parseInt(Math.random() * 10000 + 1, 10);
}

const getFileName = (path) => {
  if(path.lastIndexOf("\\") >= 0){
    let reg = new RegExp("\\\\","g");
    path = path.replace(reg,"/");
  }
  return path.substring(path.lastIndexOf("/") + 1);
}


export default {
  name: "EditBlogTemplate",

  model: {
    prop: 'value',
    event: 'change'
  },

  components: {
    // HomeOutlined,
    // UploadOutlined,
    // PlusOutlined,
  },

  props: {
    blog_id: String, // blog_id
    text:{
      type: String,
      required: false,
      default: "点击上传"
    },
    fileType:{
      type: String,
      required: false,
      default: FILE_TYPE_IMG
    },
    /*这个属性用于控制文件上传的业务路径*/
    bizPath:{
      type: String,
      required: false,
      default: "temp"
    },
    value: {
      type: [String, Array],
      required: false
    },
    // update-begin-  for:Jupload组件增加是否能够点击
    disabled: {
      type: Boolean,
      required: false,
      default: false
    },

  },

  data() {
    let { random_int, hash_code } = authentication_hash_code("");
    console.log("[EditBlogNavigation][data]: ", hash_code, random_int);
    return {
      $router: router,
      blog_title: "",
      blog_hidden: 0,
      blog_directory_1: "",
      blog_directory_2: "",
      blog_text: "",
      blog_established_time: "",
      blog_edited_time: "",
      blog_visitor_count: 0,

      blog_markdown: "### loading ...",

      random_int: random_int,
      hash_code: hash_code,

      already_updated_flag: false, // 第一次提交是新建，后续提交是更新
      already_deleted_flag: false, // 第一次删除
      update_info: "",  // 提交信息
      delete_info: "",  // 提交信息

      uploadAction: config.blog_asset_host + "/blog_api/insert_image",  //图片上传地址
      isCreatFile: true,  //是否创建文件占位dom
      headers: {},
      fileList: [],
      blog_image_path: [],
      previewVisible: false,
      urlDownload: config.blog_asset_host

    };
  },

  computed: {
    markdownToHtml() {
      var markdown_content = this.markdown_renderer(this.blog_markdown);
      return markdown_content;
    },

    conditionalBlogId() {
      if (this.blog_id === "newblog") {
        // 确保 this.blog_established_time 是一个有效的字符串
        if (this.blog_established_time && this.blog_established_time.length > 10) {
          return (
            this.blog_established_time.slice(0, 4) +
            this.blog_established_time.slice(5, 7) +
            this.blog_established_time.slice(8, 10)
          );
        }
        // 如果 this.blog_established_time 不是一个有效的字符串，可以返回一个默认值或者空字符串
        return '';
      }
      // 如果 this.blog_id 不等于 "newblog"，就返回 this.blog_id 本身
      return this.blog_id;
    }

  },

  // mounted() {
  //   this.fetch_data();
  // },

  methods: {
    get_blog_image_path () {
      let { random_int, hash_code } = authentication_hash_code("");
      blog_backend({
        url: "/blog_api/get_blog_image_path",
        data: {
          random_num: random_int,
          hash_code: hash_code,
          blog_id: this.blog_id,
        }})
        .then((response) => {
          if (response.data.is_ok) {
            console.log("[EditBlogTemplate][get_blog_image_path] success",
              response.data.detail, this.blog_id);
            this.blog_image_path = response.data.detail;
            return;
          } else {
            console.log('[EditBlogTemplate][get_blog_image_path] Failed');
            this.blog_image_path = [];
          }
        })
        .catch(() => {
          console.log('[EditBlogTemplate][get_blog_image_path] Failed');
          this.blog_image_path = [];
        });
    },

    initFileList(paths){
      console.log("[EditBlogTemplate][initFileList]: ", paths);
      if(!paths || paths.length==0){
        //return [];
        // update-begin-,Jupload组件初始化bug
        this.fileList = [];
        return;
        // update-end-,Jupload组件初始化bug
      }
      this.fileList = [];
      let arr = paths.split(",")
      for(var a = 0; a < arr.length; a++){
        this.fileList.push({
          uid: uidGenerator(),
          name: getFileName(arr[a]),
          status: 'done',
          url: this.urlDownload + arr[a],
          response: {
            status: "history",
            message: arr[a]
          }
        })
      }
    },

    handlePathChange () {
      let uploadFiles = this.fileList
      let path = ''
      if(!uploadFiles || uploadFiles.length==0){
        path = ''
      }
      let arr = [];

      for(var a = 0; a < uploadFiles.length; a++){
        if(uploadFiles[a].response){
          arr.push(uploadFiles[a].response.message)
        }
      }
      if(arr.length>0){
        path = arr.join(",")
      }
      this.$emit('change', path);
    },

    beforeUpload (file) {  //上传文件前对文件类型判断
      var fileType = file.type.slice(0, 5);
      console.log("[EditBlogNavigation][beforeUpload]: ", file, this.fileType);
      if (fileType === this.fileType) {
        this.isCreatFile = true;
        return true;
      }
      else{
        console.log("[EditBlogNavigation][beforeUpload]: ", this.fileType, fileType, FILE_TYPE_IMG);
        if (this.fileType === FILE_TYPE_IMG) {
          if (fileType.indexOf('image') <0 ) {
            this.$message.warning('请上传图片');
            this.isCreatFile = false;
            return false;
          }
        }
        this.isCreatFile = false;
        return false;
      }
      //TODO 扩展功能验证文件大小
    },

    handleChange(info) {
      console.log("[EditBlogNavigation][handleChange] isCreatFile: ", this.isCreatFile);
      if (this.isCreatFile == false) {
        return false;
      }

      let fileList = info.fileList
      if (info.file.status === 'done') {
        console.log("[EditBlogNavigation][hancleChange]: ", info);  // 已经请求过了
        if (info.file.response.is_ok) {
          fileList = fileList.map((file) => {
            if (file.response) {
              console.log("[EditBlogNavigation][hancleChange] : ", file.response);

              if (this.blog_id === "newblog") {
                console.log("[EditBlogNavigation][hancleChange] newblog: ", this.blog_established_time);
                let tmp_blog_id = this.blog_established_time.slice(0, 4) + this.blog_established_time.slice(5, 7) + this.blog_established_time.slice(8, 10);
                file.url = this.urlDownload + '/blog_image/' + tmp_blog_id + '/' + file.response.detail.image_name;
              } else {
                file.url = this.urlDownload + '/blog_image/' + this.blog_id + '/' + file.response.detail.image_name;
              }

              // file.name = file.response.detail.image_name;
              file.name = "![](" + file.url + ")";
            }
            return file;
          });
          this.$message.success(`${info.file.name} 上传成功!`);
        } else {
          this.$message.error(`${info.file.name} 上传失败，后端 is_ok = False`);
        }
      } else if (info.file.status === 'error') {
        this.$message.error(`${info.file.name} 上传失败，http 非 200`);
      } else if (info.file.status === 'removed'){
        console.log("[EditBlogTemplate][handleChange] start remove file: ", info.file);
        this.handleDelete(info.file)
      }
      this.fileList = fileList
      if (info.file.status==='done' || info.file.status === 'removed') {
        this.handlePathChange()
      }
    },

    handleImgCancel (file) {
      console.log("[EditBlogTemplate][handleImgCancel]: ", file);
      this.previewVisible = false;
    },

    handleDelete (file) {
      // 删除已上传的图片
      let { random_int, hash_code } = authentication_hash_code("");
      console.log("[EditBlogTemplate][handleDelete]: ", file);
      let attemptCount = 0;
      const MAX_ATTEMPTS = 3;
      const parts = file.name.split('/');
      const image_name = parts[parts.length - 1];

      const attemptRequest = () => {
        if (attemptCount >= MAX_ATTEMPTS) {
          console.log("[EditBlogTemplate][handleDelete] Maximum attempts reached.");
          this.$message.error(`${image_name} 删除失败!`);
          return; // 如果已达到最大尝试次数，则不再继续重试
        };

        blog_backend({
          url: "/blog_api/delete_image",
          data: {
            random_num: random_int,
            hash_code: hash_code,
            image_name: image_name,
            blog_id: this.blog_id,
          }})
          .then((response) => {
            if (response.data.is_ok) {
              console.log("[EditBlogTemplate][handleDelete] success",
                response.data.detail, image_name);
              this.$message.success(`${image_name} 删除成功!`);
              return;
            } else {
              // console.log('[EditBlogTemplate][handleDelete] Failed');
              attemptCount++;
              console.log(`[EditBlogTemplate][handleDelete] Retrying... Attempt ${attemptCount + 1}`);
              attemptRequest();
            }
          })
          .catch(() => {
            attemptCount++;
            console.log(`[EditBlogTemplate][handleDelete] Retrying... Attempt ${attemptCount + 1}`);
            attemptRequest();
          });

      };

      attemptRequest();

    },

    fetch_data() {
      if (this.blog_id === "newblog") {
        this.blog_title = "";
        this.blog_hidden = 0;
        this.blog_directory_1 = "";
        this.blog_directory_2 = "";
        this.blog_text = "";
        this.blog_established_time = "";
        this.blog_edited_time = "";
        this.blog_visitor_count = 0;
        this.blog_image_path = [];
        this.fileList = [];

        this.blog_markdown = "### loading ...";
      } else {
        let { random_int, hash_code } = authentication_hash_code("");
        let attemptCount = 0; // 初始化尝试次数计数器
        const MAX_ATTEMPTS = 3; // 设置最大尝试次数

        console.log("[EditBlogTemplate][fetch_data] blog_id: " + this.blog_id);
        const attemptRequest = () => {
          if (attemptCount >= MAX_ATTEMPTS) {
            console.log("[EditBlogTemplate][fetch_data] Maximum attempts reached.");
            return; // 如果已达到最大尝试次数，则不再继续重试
          };

          blog_backend({
            url: "/blog_api/get_one_blog",
            data: {
              random_num: random_int,
              hash_code: hash_code,
              blog_id: this.blog_id,
            }
          })
          .then((response) => {
            if (response.data.is_ok) {
              this.blog_markdown = response.data.detail['blog_text'];
              console.log("[EditBlogTemplate][fetch_data]", response.data.detail, this.blog_id);

              this.blog_visitor_count = response.data.detail.visitor_count;
              this.blog_title = response.data.detail.blog_title;
              this.blog_hidden = response.data.detail.hidden;
              this.blog_directory_1 = response.data.detail.directory_1;
              this.blog_directory_2 = response.data.detail.directory_2;
              this.blog_text = response.data.detail.blog_text;
              this.blog_established_time = response.data.detail.established_time;
              this.blog_edited_time = response.data.detail.edited_time;

              document.title = this.title + " | JioNLP";
              this.established_time = response.data.detail.established_time;
              console.log("[EditBlogTemplate][fetch_data]",
                this.blog_title, this.blog_text.length);
            } else {
              attemptCount++;
              console.log(`[EditBlogTemplate][fetch_data] Retrying... Attempt ${attemptCount + 1}`);
              attemptRequest();
            }
          })
          .catch(() => {
            this.blog_markdown = "### Failed to request markdown file.";

            this.visitor_count = 0;
            document.title = this.blog_id + " | JioNLP";
            attemptCount++;
            console.log(`[EditBlogTemplate][fetch_data] Retrying... Attempt ${attemptCount + 1}`);
            attemptRequest();
          });
        };

        attemptRequest();
      }

    },

    get_current_time() {
      const now = new Date();
      const isoString = now.toISOString();

      // 转换为 YYYY-MM-DDTHH:mm:ss.sss 格式并替换 T 为空间
      const formatted_date = isoString.slice(0, 19).replace('T', ' ');

      console.log(formatted_date);
      return formatted_date
    },

    get_blog_id(dateTimeString) {
      // 截取前10个字符（日期部分）
      let dateString = dateTimeString.slice(0, 10);
      let formattedDate = dateString.replace(/-/g, '');  // 替换掉日期中的破折号（-）

      console.log("get_blog_id: ", formattedDate); // 输出：20231230
      return formattedDate;
    },

    send_edited_blog() {
      let { random_int, hash_code } = authentication_hash_code("");
      if (this.blog_id === "newblog") {

        blog_backend({
          url: "/blog_api/insert_blog",
          data: {
            random_num: random_int,
            hash_code: hash_code,
            blog_id: this.get_blog_id(this.blog_established_time),
            frontend_page_name: this.get_blog_id(this.blog_established_time),
            established_time: this.blog_established_time,
            edited_time: this.blog_edited_time,
            visitor_count: this.blog_visitor_count,
            blog_title: this.blog_title,
            blog_text: this.blog_text,
            hidden: this.blog_hidden,
            directory_1: this.blog_directory_1,
            directory_2: this.blog_directory_2,
          }
        })
        .then((response) => {
          this.already_updated_flag = true;
          if (response.data.is_ok) {
            this.update_info = "提交成功";
            console.log("[EditBlogTemplate][insert_blog] success", response.data.detail);
          } else {
            if (response.data.detail === "duplicate primary key") {
              // 重复提交
              this.update_info = "blog ID 重复提交";
              console.log("[EditBlogTemplate][insert_blog] failure", response.data.detail);
            } else {
              this.update_info = "提交失败";
              console.log("[EditBlogTemplate][insert_blog] failure", response.data.detail);
            }

          }
        })
        .catch(() => {
          this.already_updated_flag = true;
          this.update_info = "提交失败（网络报错）";
          console.log("[EditBlogTemplate][insert_blog] failure");
        });
      } else {

        blog_backend({
          url: "/blog_api/update_blog",
          data: {
            random_num: random_int,
            hash_code: hash_code,
            blog_id: this.blog_id,
            frontend_page_name: this.blog_id,
            edited_time: this.blog_edited_time,
            blog_title: this.blog_title,
            blog_text: this.blog_text,
            hidden: this.blog_hidden,
            directory_1: this.blog_directory_1,
            directory_2: this.blog_directory_2,
          }
        })
        .then((response) => {
          this.already_updated_flag = true;
          // console.log(response.data, this.blog_hidden);
          if (response.data.is_ok) {
            this.update_info = "提交成功";
            console.log("[EditBlogTemplate][update_blog] success", response.data.detail);
          } else {
            this.update_info = "提交失败";
            console.log("[EditBlogTemplate][update_blog] failure", response.data.detail);
          }
        })
        .catch(() => {
          this.already_updated_flag = true;
          this.update_info = "提交失败（网络报错）";
          console.log("[EditBlogTemplate][update_blog] failure");
        });
      }
    },

    delete_blog() {
      let { random_int, hash_code } = authentication_hash_code("");
      blog_backend({
        url: "/blog_api/delete_blog",
        data: {
          random_num: random_int,
          hash_code: hash_code,
          blog_id: this.get_blog_id(this.blog_established_time),
        }
      })
      .then((response) => {
        this.already_deleted_flag = true;
        if (response.data.is_ok) {
          this.delete_info = "删除成功";
          console.log("[EditBlogTemplate][delete_blog] success", response.data.detail);
        } else {
          if (response.data.detail === "duplicate primary key") {
            // 重复提交
            this.delete_info = "blog ID 不在数据库";
            console.log("[EditBlogTemplate][delete_blog] failure", response.data.detail);
          } else {
            this.delete_info = "删除失败";
            console.log("[EditBlogTemplate][delete_blog] failure", response.data.detail);
          }

        }
      })
      .catch(() => {
        this.already_deleted_flag = true;
        this.delete_info = "删除失败（网络报错）";
        console.log("[EditBlogTemplate][delete_blog] failure");
      });
    }
  },

  created() {

    if (this.blog_id === "newblog") {
      console.log("[EditBlogTemplate][created] new blog.")
      this.fileList = [];
      this.blog_image_path = [];
    } else {
      this.fileList = [];
      this.fetch_data();
      this.get_blog_image_path();
    }
  },

  updated() {
    if (this.blog_id === "newblog") {
      console.log("[EditBlogTemplate][updated] new blog.")
      this.fileList = [];
      this.blog_image_path = [];
    } else {
      this.fileList = [];
      this.fetch_data();
      this.get_blog_image_path();
    }
  },

  watch: {
    value(val){
      console.log("[watch]: ", val)
      if (val instanceof Array) {
        this.initFileList(val.join(','))
      } else {
        this.initFileList(val)
      }
    }
  },


};
</script>

<style lang="less" scoped>
#editblog-template {
  margin-left: 250px;
}

@media screen and (max-width: 800px) {
  #editblog-template {
    margin-left: 0px;
  }
}

textarea {
  width: 600px;
}

.upload-list-inline :deep(.ant-upload-list-item) {
  float: left;
  width: 550px;
  margin-right: 8px;
}

h1 {
  width: 100%;
  // height: 80px;
  font-size: 28px;
  padding-top: 5px;
  margin: 10px;
}

.b_green {
  color: #00b441;
}

.description_text {
  text-align: right;
  font-size: 10px;
  color: #777777;
}

.custom-button {
  background-color: #4CAF50; /* 按钮背景色 */
  color: white; /* 文字颜色 */
  border: none; /* 无边框 */
  padding: 10px 20px; /* 内边距 */
  border-radius: 5px; /* 圆角 */
  cursor: pointer; /* 鼠标悬停时的光标 */
  transition: background-color 0.3s; /* 背景色过渡效果 */
}

.custom-button:hover {
  background-color: #4395E1; /* 悬停时的背景色 */
}
</style>
