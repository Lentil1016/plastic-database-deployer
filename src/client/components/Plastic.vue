<template>
    <div>
        <div id="deployWidget">
            <el-switch
                    style="padding-right: 5px"
                    v-model="newDatabase.isMysql"
                    active-color="#13ce66"
                    inactive-color="#ff7575"
                    active-text="Mysql"
                    inactive-text="Oracle">
            </el-switch>
            <el-button>Deploy</el-button>
        </div>
        <el-table v-loading="loading" :data="items" stripe >
            <el-table-column prop="name" label="容器">
            </el-table-column>
            <el-table-column label="版本">
                <template slot-scope="scope">
                    <img v-bind:src="scope.row.badge" height="20"/>
                </template>
            </el-table-column>
        </el-table>
    </div>
</template>

<script>
export default {
  created() {
    this.$axios.get('/plastic')
      .then((res) => {
        this.item=res
        this.loading=false
      })
  },
  data() {
    return {
      newDatabase: {
        isMysql: false
      },
      loading: true,
      items: [{
        name: "尚未创建容器数据库",
        badge: ""
      }]
    }
  }
}
</script>
