provider "google" {
  project = "dalprojects"
  region  = "us-central1"
}

resource "google_compute_disk" "a3-disk" {
  name = "a3-disk"
  type = "pd-standard"
  zone = "us-central1-a"
  size = 10
}

resource "google_container_cluster" "cluster-2" {
  name     = "cluster-2"
  location = "us-central1"

  node_locations = ["us-central1-a"]
  initial_node_count = 1

  node_config {
    machine_type = "e2-small"
    disk_size_gb = 20
    disk_type    = "pd-standard"
  }

  network = "default"
}