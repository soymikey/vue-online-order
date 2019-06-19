
<template>
  <div
    class="drag-container"
    v-drag-and-drop:options="options"
  >
    <ul class="drag-list">
      <li
        class="drag-column"
        v-for="group in groups"
        :key="group.id"
      >
        <span class="drag-column-header">
          <h2>{{ group.name }}</h2>
          <feather-icon type="more-vertical"></feather-icon>
        </span>
        <vue-draggable-group
          v-model="group.items"
          :groups="groups"
          :data-id="group.id"
          @change="onGroupsChange"
        >
          <ul
            class="drag-inner-list"
            :data-id="group.id"
          >
            <li
              class="drag-item"
              v-for="item in group.items"
              :key="item.id"
              :data-id="item.id"
            >
              <div class="drag-item-text">{{ item.name }}</div>
            </li>
          </ul>
          <!-- <transition-group
          type="transition"
          :name="!drag ? 'flip-list' : null"
        >
          <li
            class="list-group-item"
            v-for="element in list"
            :key="element.order"
          >
            <i
              :class="
                element.fixed ? 'fa fa-anchor' : 'glyphicon glyphicon-pushpin'
              "
              @click="element.fixed = !element.fixed"
              aria-hidden="true"
            ></i>
            {{ element.name }}
          </li>
        </transition-group> -->
        </vue-draggable-group>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  data() {
    return {
      groups: [
        {
          id: 1,
          name: 'To Do',
          items: [
            { id: 1, name: 'Item 1', groupId: 1 },
            { id: 2, name: 'Item 2', groupId: 1 },
            { id: 3, name: 'Item 3', groupId: 1 }
          ]
        },
        {
          id: 2,
          name: 'In Progress',
          items: [
            { id: 4, name: 'Item 4', groupId: 2 },
            { id: 5, name: 'Item 5', groupId: 2 },
            { id: 6, name: 'Item 6', groupId: 2 }
          ]
        },
        {
          id: 3,
          name: 'Done',
          items: [
            { id: 7, name: 'Item 7', groupId: 3 },
            { id: 8, name: 'Item 8', groupId: 3 },
            { id: 9, name: 'Item 9', groupId: 3 },
            { id: 10, name: 'Item 10', groupId: 3 }
          ]
        }
      ],
      options: {
        dropzoneSelector: '.drag-inner-list',
        draggableSelector: '.drag-item'
      }
    }
  },
  methods: {
    onGroupsChange(e) {
      console.log({ e })
    }
  }
}
</script>

<style>
.button {
  margin-top: 35px;
}
.flip-list-move {
  transition: transform 0.5s;
}
.no-move {
  transition: transform 0s;
}
.ghost {
  opacity: 0.5;
  background: #c8ebfb;
}
.list-group {
  min-height: 20px;
}
.list-group-item {
  cursor: move;
}
.list-group-item i {
  cursor: pointer;
}
</style>
