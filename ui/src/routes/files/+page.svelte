<script lang=ts>
    import { onMount } from 'svelte';
    import { TreeView, TreeViewItem, RecursiveTreeView, type TreeViewNode } from '@skeletonlabs/skeleton';

    let myTreeViewNodes: TreeViewNode[] = [
	{
		id: 'fo1',
		content: 'folder 1',
		lead: '(icon)',
		children: [
			{
                id: 'fi1',
                content: 'file 1',
                lead: '(icon)',
            },
            {
                id: 'fi2',
                content: 'file 2',
                lead: '(icon)',
            }
		]
	},
	{
        id: 'fo2',
        content: 'folder 2',
        lead: '(icon)',
        children: [
            {
                id: 'fi3',
                content: 'file 3',
                lead: '(icon)',
            }
        ]
    },

]

    let selectedFile:any = null;

    function selectFile(file:any) {
        selectedFile = file;
    }

    onMount(() => {
        // Fetch file data from API or perform any other initialization logic
    });
</script>
<section class="img-bg mt-28" />
<div class="grid grid-cols-12 gap-4">
    <div class="col-span-3">
        <RecursiveTreeView class="h-full" nodes={myTreeViewNodes}/>
    </div>
    <div class="col-span-9 p-4">
        <span class="block mb-4">test</span>
    </div>
</div>

<style lang="postcss">
.img-bg {
    @apply w-64 h-64 md:w-80 md:h-80;
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
}
.img-bg {
    @apply absolute z-[-1] rounded-full blur-[50px] transition-all;
    animation: pulse 5s cubic-bezier(0, 0, 0, 0.5) infinite,
        glow 5s linear infinite;
}
@keyframes glow {
    0% {
        @apply bg-primary-400/50;
    }
    33% {
        @apply bg-secondary-400/50;
    }
    66% {
        @apply bg-tertiary-400/50;
    }
    100% {
        @apply bg-primary-400/50;
    }
}
@keyframes pulse {
    50% {
        transform: translate(-50%, -80%) scale(1.5);
    }
}
</style>
