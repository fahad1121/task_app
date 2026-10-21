<?php

namespace Tests\Feature;

use App\Models\Task;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class TaskApiTest extends TestCase
{
    use RefreshDatabase;

    public function test_tasks_can_be_listed(): void
    {
       Task::create([
    'title' => 'Assessment task',
    'description' => null,
    'completed' => false,
]);

        $this->getJson('/api/tasks')
            ->assertOk()
            ->assertJsonFragment([
                'title' => 'Assessment task',
            ]);
    }

    public function test_a_task_can_be_created(): void
    {
        $this->postJson('/api/tasks', [
            'title' => 'Complete assessment',
            'description' => 'Build the task manager',
            'completed' => false,
        ])
            ->assertCreated()
            ->assertJsonPath('title', 'Complete assessment');

        $this->assertDatabaseHas('tasks', [
            'title' => 'Complete assessment',
            'completed' => false,
        ]);
    }

    public function test_task_title_is_required(): void
    {
        $this->postJson('/api/tasks', [
            'description' => 'Missing title',
        ])
            ->assertUnprocessable()
            ->assertJsonValidationErrors(['title']);
    }

    
public function test_a_task_can_be_updated(): void
{
    $task = Task::create([
        'title' => 'Original title',
        'description' => null,
        'completed' => false,
    ]);

    $this->putJson("/api/tasks/{$task->id}", [
        'title' => 'Updated title',
        'completed' => true,
    ])
        ->assertOk()
        ->assertJsonPath('title', 'Updated title')
        ->assertJsonPath('completed', true);

    $this->assertDatabaseHas('tasks', [
        'id' => $task->id,
        'title' => 'Updated title',
        'completed' => true,
    ]);
}


    
public function test_a_task_can_be_deleted(): void
{
    $task = Task::create([
        'title' => 'Task to delete',
        'description' => null,
        'completed' => false,
    ]);

    $this->deleteJson("/api/tasks/{$task->id}")
        ->assertNoContent();

    $this->assertDatabaseMissing('tasks', [
        'id' => $task->id,
    ]);
}

}
