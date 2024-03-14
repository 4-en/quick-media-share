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
                onClick: () => selectFile({ name: 'file 1' })
            },
            {
                id: 'fi2',
                content: 'file 2',
                lead: '(icon)',
                onClick: () => selectFile({ name: 'file 2' })
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
                onClick: () => selectFile({ name: 'file 3' })
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

<div class="grid">
    <div class="grid-row">
        <div class="grid-col-4">
            <RecursiveTreeView nodes={myTreeViewNodes} />
        </div>
        <div class="grid-col-8">
            <span>test</span>
            {#if selectedFile}
                <h2>{selectedFile.name}</h2>
            {/if}
        </div> 
    </div>
</div>

<style>
</style>